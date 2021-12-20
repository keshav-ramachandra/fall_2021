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


with open('users_data.json') as f_in:
    data = json.load(f_in)


def str_time_prop(start, end, time_format, prop):
    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))
    ptime = stime + prop * (etime - stime)
    return time.strftime(time_format, time.localtime(ptime))


def random_date(start, end, prop):
    return str_time_prop(start, end, '%Y-%m-%d', prop)


def gen_phone():
    first = str(random.randint(100,999))
    second = str(random.randint(1,888)).zfill(3)
    last = (str(random.randint(1,9998)).zfill(4))
    while last in ['1111','2222','3333','4444','5555','6666','7777','8888']:
        last = (str(random.randint(1,9998)).zfill(4))
    return '{}-{}-{}'.format(first,second, last)

for i in range(1000):
    first_name = data["results"][i]["name"]["first"]
    last_name = data["results"][i]["name"]["last"]
    user_name = data["results"][i]["login"]["username"]
    email = data["results"][i]["email"]
    password = data["results"][i]["login"]["password"]
    phone_number = gen_phone()
    dob = random_date("1920-1-1", "2021-1-1", random.random())
    profile_photo_url = data["results"][i]["picture"]["medium"]

    content = urllib.request.urlretrieve(profile_photo_url)
    try:
        user = User(user_name = user_name, first_name = first_name,last_name = last_name, email=email, password = password, phone_number = phone_number, dob = dob)
        user.profile_photo_url.save(
                    os.path.basename(user_name),
                    File(open(content[0], 'rb'))
                    )
        if user:
            user.save()
    except Exception as e:
        print(e)


   


