import django
import os
from faker import Faker
import factory
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
import datetime
from authentication.models import User
from posts.models import Post, Restaurant, FoodType, FoodtypeTag, SavedList
from factory import fuzzy
from factory.django import DjangoModelFactory
import random
import time
from PIL import Image
import requests
from urllib.parse import urlparse
from django.core.files import File
import urllib.request
import requests
from django.conf.urls.static import static



r_users = User.objects.all()
r_posts = Post.objects.all()

for i in range(1000):
    like_type = random.randint(1,2)
    random_post = random.choice(r_posts)
    random_user = random.choice(r_users)
    try:
        SavedList.objects.create(user_id=random_user,post_id=random_post,like=like_type)
    except Exception as e:
        print(e)

 