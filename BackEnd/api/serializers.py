
from rest_framework.serializers import ModelSerializer
from .models import LicensePlate, User


class LicensePlateSerializer(ModelSerializer):
    class Meta:
        model = LicensePlate
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
