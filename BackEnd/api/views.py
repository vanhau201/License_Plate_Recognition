from unittest import result
from urllib import response
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from .models import LisencePlate, User
from .serializers import LisencePlateSerializer, UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.pagination import PageNumberPagination
from .Paginator import CustomPagination
from .utils import base64_to_img, cat_bien_so, lay_ki_tu, predict_bienso, img_to_base64
import cv2
import tensorflow as tf
import uuid
from base64 import b64decode
from django.core.files.base import ContentFile
import time
import datetime
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
# load model DL
net = cv2.dnn.readNet('./models/yolov4-tiny.cfg',
                      './models/yolov4-tiny_3000.weights')
model_chuso = tf.keras.models.load_model("./models/cnn_chuso_final.h5")
model_chucai = tf.keras.models.load_model("./models/cnn_chucai_final.h5")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET", ])
def Routes(request):

    domain = request.build_absolute_uri()

    routers = {
        "List License Plate": "/list-license-plate/",
        "Token": "/token/",
        "Refresh Token": "/token/refresh/",
        "Register" : "register",
        "Check In": "/checkin/",
        "Check Out": "/checkout/",
        "Update Check In" :"/update-checkin/",
        "Update Check Out" :"/update-checkout/",
        "Delete": "/delete/<str:pk>/"
    }

    return Response(routers)


@api_view(["POST"])
def Register(request):
    username = request.data["username"]
    email = request.data["email"]
    password = request.data["password"]

    check_user = User.objects.filter(username=username)
    if len(check_user) > 0:

        return Response(status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(email=email,
                               username=username,
                               password=make_password(password),
                               is_staff=False)
    userSerializer = UserSerializer(user)

    return Response(userSerializer.data)


class ListLisencePlate(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    # queryset = LisencePlate.objects.all()
    serializer_class = LisencePlateSerializer
    pagination_class = CustomPagination

    def get_queryset(self):

        user = self.request.user
        display = self.request.query_params.get("display")
        search = self.request.query_params.get("search")

        if display == "all":
            lisencePlate = LisencePlate.objects.filter(
                active=True, user__id=user.id)
            if search is None:
                return lisencePlate
            else:
                return lisencePlate.filter(result__icontains=search)
        elif display == "today":
            today = datetime.date.today()
            lisencePlate = LisencePlate.objects.filter(active=True, user__id=user.id, created_date__year=today.year,
                                                       created_date__month=today.month, created_date__day=today.day)
            if search is None:
                return lisencePlate
            else:
                return lisencePlate.filter(result__icontains=search)


@api_view(["POST", ])
@permission_classes([IsAuthenticated])
def CheckIn(request):
    try:
        img_base64 = request.data['base64']
        type_select = request.data['type']

        image_cv2 = base64_to_img(img_base64)
        lisencePlate_confidence = cat_bien_so(image_cv2, net)
        if lisencePlate_confidence is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            img = lisencePlate_confidence[0]
            confidence = lisencePlate_confidence[1]
            if type_select == 'daytime':
                top_bot = lay_ki_tu(img, 'daytime')
            if type_select == 'evening':
                top_bot = lay_ki_tu(img, 'evening')
            if top_bot is not None:
                top = top_bot[0]
                bot = top_bot[1]
                rs = predict_bienso(top, bot, model_chuso, model_chucai)
                # get user
                userCurrent = User.objects.get(id=request.user.id)

                # check duplicate
                listLisencePlate = LisencePlate.objects.filter(active=True,
                                                               user__id=userCurrent.id, result=rs, status=True)

                if len(listLisencePlate) > 0:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

                image_data = b64decode(img_to_base64(img))
                image_name = str(uuid.uuid4())+".jpg"

                # save in models
                image = ContentFile(image_data, image_name)

                lisencePlate = LisencePlate(image=image, confidences=confidence, result=rs,
                                            user=userCurrent)
                lisencePlate.save()

                obj_last = LisencePlate.objects.last()
                serializer_obj = LisencePlateSerializer(
                    obj_last, many=False, context={'request': request})
                return Response(serializer_obj.data, status=status.HTTP_201_CREATED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", ])
@permission_classes([IsAuthenticated])
def CheckOut(request):
    try:
        img_base64 = request.data['base64']
        type_select = request.data['type']
        image_cv2 = base64_to_img(img_base64)
        lisencePlate_confidence = cat_bien_so(image_cv2, net)
        if lisencePlate_confidence is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            img = lisencePlate_confidence[0]
            confidence = lisencePlate_confidence[1]
            if type_select == 'daytime':
                top_bot = lay_ki_tu(img, 'daytime')
            if type_select == 'evening':
                top_bot = lay_ki_tu(img, 'evening')
            if top_bot is not None:
                top = top_bot[0]
                bot = top_bot[1]
                rs = predict_bienso(top, bot, model_chuso, model_chucai)

            lisencePlate = LisencePlate.objects.filter(
                active=True, status=True, result=rs, user__id=request.user.id)
            if len(lisencePlate) > 0:
                lisencePlate[0].status = False
                lisencePlate[0].save()
                lisencePlateSerializer = LisencePlateSerializer(
                    lisencePlate[0])

                return Response(lisencePlateSerializer.data, status=status.HTTP_200_OK)

            res = {
                "image": "data:image/jpeg;base64,"+img_to_base64(img),
                "confidences": confidence,
                "result": rs,
            }
        return Response(res, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def DeleteLicensePlate(request, pk):
    lisencePlate = LisencePlate.objects.filter(
        id=pk, active=True, user__id=request.user.id)
    if len(lisencePlate) > 0:
        lisencePlate[0].active = False
        lisencePlate[0].save()
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateCheckIn(request):
    id = request.data['id']
    result = request.data["result"]

    lisencePlate = LisencePlate.objects.filter(
        id=id, active=True, status=True, user__id=request.user.id)
    if len(lisencePlate) > 0:

        lisencePlate[0].result = result
        lisencePlate[0].save()
        serializer = LisencePlateSerializer(lisencePlate[0])
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def UpdateCheckOut(request):
    numberLP = request.data['result']
    lisencePlate = LisencePlate.objects.filter(
        user__id=request.user.id, result=numberLP, status=True)

    if len(lisencePlate) > 0:
        lisencePlate[0].status = False
        lisencePlate[0].save()
        serializer = LisencePlateSerializer(lisencePlate[0])
        return Response(serializer.data, status=status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
