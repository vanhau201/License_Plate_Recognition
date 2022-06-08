from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from .models import LicensePlate, User
from .serializers import LicensePlateSerializer, UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.pagination import PageNumberPagination
from .Paginator import CustomPagination
from .utils import base64_to_img, cat_bien_so, lay_ki_tu, predict_bienso, img_to_base64,getListDay
import cv2
import tensorflow as tf
import uuid
from base64 import b64decode
from django.core.files.base import ContentFile
import time
import datetime
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db.models import Count
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



class ListLicensePlate(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    serializer_class = LicensePlateSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        display = self.request.query_params.get("display")
        search = self.request.query_params.get("search")
        if display == "all":
            licensePlate = LicensePlate.objects.filter(
                active=True, user__id=user.id)
            if search is None:
                return licensePlate
            else:
                return licensePlate.filter(result__icontains=search)
        elif display == "today":
            today = datetime.date.today()
            licensePlate = LicensePlate.objects.filter(active=True, user__id=user.id, created_date__year=today.year,
                                                       created_date__month=today.month, created_date__day=today.day)
            if search is None:
                return licensePlate
            else:
                return licensePlate.filter(result__icontains=search)


@api_view(["POST", ])
@permission_classes([IsAuthenticated])
def CheckIn(request):
    try:
        img_base64 = request.data['base64']
        type_select = request.data['type']

        image_cv2 = base64_to_img(img_base64)
        licensePlate_confidence = cat_bien_so(image_cv2, net)
        if licensePlate_confidence is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            img = licensePlate_confidence[0]
            confidence = licensePlate_confidence[1]
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
                listLicensePlate = LicensePlate.objects.filter(active=True,
                                                               user__id=userCurrent.id, result=rs, status=True)

                if len(listLicensePlate) > 0:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

                image_data = b64decode(img_to_base64(img))
                image_name = str(uuid.uuid4())+".jpg"

                # save in models
                image = ContentFile(image_data, image_name)

                licensePlate = LicensePlate(image=image, confidences=confidence, result=rs,
                                            user=userCurrent)
                licensePlate.save()

                obj_last = LicensePlate.objects.last()
                serializer_obj = LicensePlateSerializer(
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
        licensePlate_confidence = cat_bien_so(image_cv2, net)
        if licensePlate_confidence is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            img = licensePlate_confidence[0]
            confidence = licensePlate_confidence[1]
            if type_select == 'daytime':
                top_bot = lay_ki_tu(img, 'daytime')
            if type_select == 'evening':
                top_bot = lay_ki_tu(img, 'evening')
            if top_bot is not None:
                top = top_bot[0]
                bot = top_bot[1]
                rs = predict_bienso(top, bot, model_chuso, model_chucai)

            licensePlate = LicensePlate.objects.filter(
                active=True, status=True, result=rs, user__id=request.user.id)
            if len(licensePlate) > 0:
                licensePlate[0].status = False
                licensePlate[0].save()
                licensePlateSerializer = LicensePlateSerializer(
                    licensePlate[0])

                return Response(licensePlateSerializer.data, status=status.HTTP_200_OK)

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
    licensePlate = LicensePlate.objects.filter(
        id=pk, active=True, user__id=request.user.id)
    if len(licensePlate) > 0:
        licensePlate[0].active = False
        licensePlate[0].save()
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateCheckIn(request):
    id = request.data['id']
    result = request.data["result"]

    licensePlate = LicensePlate.objects.filter(
        id=id, active=True, status=True, user__id=request.user.id)
    if len(licensePlate) > 0:

        licensePlate[0].result = result
        licensePlate[0].save()
        serializer = LicensePlateSerializer(licensePlate[0])
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateCheckOut(request):
    numberLP = request.data['result']
    licensePlate = LicensePlate.objects.filter(
        user__id=request.user.id, result=numberLP, status=True)

    if len(licensePlate) > 0:
        licensePlate[0].status = False
        licensePlate[0].save()
        serializer = LicensePlateSerializer(licensePlate[0])
        return Response(serializer.data, status=status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateLicensePlate(request,pk):
    try:
        licensePlate = LicensePlate.objects.get(id=pk)
        if request.data['status']=="true":
            licensePlate.status = True
        elif request.data['status']=="false":
             licensePlate.status = False
        licensePlate.result = request.data['result']
        licensePlate.save()
        return Response(LicensePlateSerializer(licensePlate).data,status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Statistics(request):
    # /////
    userID = request.user.id
    today = datetime.date.today()
    today_obj = LicensePlate.objects.filter(user__id=userID, created_date__year=today.year,
                                     created_date__month=today.month, created_date__day=today.day)
    thisMonth = LicensePlate.objects.filter(user__id=userID, created_date__year=today.year,
                                     created_date__month=today.month)
    thisYear = LicensePlate.objects.filter(user__id=userID, created_date__year=today.year)

    statusTrue = LicensePlate.objects.filter(user__id=userID, status=True)

    statistics = {
        "quantity_true": len(statusTrue),
        "quantity_today": len(today_obj),
        "quantity_month": len(thisMonth),
        "quantity_year": len(thisYear),
    }
    # //////


    query = LicensePlate.objects.filter(user__id=userID, 
        created_date__gte=datetime.date.today()-datetime.timedelta(7)) \
        .extra(select={'day': 'date( created_date )'}).values("day") \
        .annotate(count = Count("created_date")) \
        .order_by()

    end = datetime.date.today()
    start = (datetime.date.today() - datetime.timedelta(7))
    listDay = getListDay(start,end)

    line_chart = {str(i):0 for i in listDay}
    

    for i in query:
        if str(i["day"]) in line_chart.keys():
           line_chart[str(i["day"])] = i["count"]
               
    statistics["line_chart"] = line_chart

    #////////////////////////

    bar_chart = {}
    for i in [today.year, today.year-1, today.year-2]:
        months = {}
        for j in range(1, 13):
            data_month = LicensePlate.objects.filter(user__id=userID, created_date__year=i,
                                              created_date__month=j)
            months[j] = len(data_month)

        bar_chart[i] = months

    statistics["bar_chart"] = bar_chart
    

    return Response(statistics,status=status.HTTP_200_OK)



