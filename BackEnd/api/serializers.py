
from rest_framework.serializers import ModelSerializer
from .models import LisencePlate, User


class LisencePlateSerializer(ModelSerializer):
    class Meta:
        model = LisencePlate
        fields = ["id", "image", "confidences",
                  "result", "status", "created_date"]
        # fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "date_joined"]

        extra_kwargs = {
            "password": {"write_only": "true"}
        }
