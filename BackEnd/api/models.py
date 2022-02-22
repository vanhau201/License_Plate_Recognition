from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
# Ceate your models here.


class LisencePlate(models.Model):
    image = models.ImageField(upload_to='images/%Y/%m/%d')
    confidences = models.FloatField()
    result = models.CharField(max_length=10)
    status = models.BooleanField(default=True)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
