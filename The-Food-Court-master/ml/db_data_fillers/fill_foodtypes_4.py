import django
import os
from faker import Faker
import factory
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
import datetime
from posts.models import FoodType
from factory import fuzzy
from factory.django import DjangoModelFactory
import random
import time
with open('meals_array.json') as f_in:
    data = json.load(f_in)


class FoodTypeFactory(DjangoModelFactory):
    class Meta:
        model = FoodType
        django_get_or_create = ('food_type','is_active')
    food_type = ''
    is_active = True


for i in range(len(data)):
    try:   
        FoodType = FoodTypeFactory(food_type=data[i]['name'])
    except:
        print('duplicate')
 
    
