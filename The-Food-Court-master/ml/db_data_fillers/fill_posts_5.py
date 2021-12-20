import django
import os
from faker import Faker
import factory
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
import datetime
from authentication.models import User
from posts.models import Post, Restaurant, FoodType, FoodtypeTag
from factory import fuzzy
from factory.django import DjangoModelFactory
import random
import time
from PIL import Image
from urllib.parse import urlparse
from django.core.files import File
import urllib.request
import requests
from django.conf.urls.static import static


with open('meals.json') as f_in:
    meals_data = json.load(f_in)


with open('restaurants.json') as f_in:
    data = json.load(f_in)


class FoodtypeTagFactory(DjangoModelFactory):
    class Meta:
        model = FoodtypeTag
        django_get_or_create = ('post','foodtype')
    post = ''
    foodtype=''


class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post
        django_get_or_create = ('user_id','restaurant_id','food_image_url','approve_status')
    user_id = ''
    restaurant_id = ''
    food_image_url = ''
    approve_status = '' 


r_users = list(User.objects.all())
#print(random_user)
r_food_types = FoodType.objects.all()
#random_food_type = random.choice(r_food_types)
#print(random_food_type['food_type'])
r_restaurants = list(Restaurant.objects.all())
#print(random_restaurant)


for i in range(1000):
    random_user = random.choice(r_users)
    random_food_type = random.choice(r_food_types)
    random_restaurant = random.choice(r_restaurants)
    #print(random_food_type)
    #content = urllib.request.urlretrieve(meals_data[random_food_type.food_type])
    try:
        content = urllib.request.urlretrieve(meals_data[random_food_type.food_type])
        post = Post(user_id=random_user,restaurant_id=random_restaurant,approve_status=1)
        post.food_image_url.save(
                    os.path.basename(meals_data[random_food_type.food_type]),
                    File(open(content[0], 'rb'))
                    )
        if post:
                ft = FoodType.objects.filter(food_type=random_food_type.food_type).first()
                post.save()
                FoodtypeTag.objects.create(
                    post = post,
                    foodtype = ft 
                )
    except Exception as e:
        print(e)

 