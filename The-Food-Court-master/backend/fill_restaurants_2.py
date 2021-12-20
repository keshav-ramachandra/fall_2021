import django
import os
from faker import Faker
import factory
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
import datetime
from posts.models import Restaurant
from factory import fuzzy
from factory.django import DjangoModelFactory
import random
import time
with open('restaurants.json') as f_in:
    data = json.load(f_in)


times = ['Monday: 4:00 – 9:00 PM,Tuesday: 4:00 – 9:00 PM,Wednesday: 4:00 – 9:00 PM,Thursday: 4:00 – 9:00 PM,Friday: 4:00 AM – 9:00 PM,Saturday: 11:00 AM – 9:00 PM,Sunday: 11:00 AM – 9:00 PM','Monday: 11:30 AM – 2:30 PM, 5:30 – 9:30 PM,Tuesday: Closed,Wednesday: 11:30 AM – 2:30 PM, 5:30 – 9:30 PM,Thursday: 11:30 AM – 2:30 PM, 5:30 – 9:30 PM,Friday: 11:30 AM – 3:00 PM, 5:30 – 10:00 PM,Saturday: 11:30 AM – 3:00 PM, 5:30 – 10:00 PM,Sunday: 11:30 AM – 3:00 PM, 5:30 – 9:30 PM','Monday: Open 24 hours,Tuesday: Open 24 hours,Wednesday: Open 24 hours,Thursday: Open 24 hours,Friday: Open 24 hours,Saturday: Open 24 hours,Sunday: Open 24 hours','Monday: 11:00 AM – 9:00 PM,Tuesday: 11:00 AM – 9:00 PM,Wednesday: 11:00 AM – 9:00 PM,Thursday: 11:00 AM – 9:00 PM,Friday: 11:00 AM – 9:00 PM,Saturday: 11:00 AM – 9:00 PM,Sunday: 11:00 AM – 9:00 PM','Monday: 10:30 AM – 12:00 AM,Tuesday: 10:30 AM – 12:00 AM,Wednesday: 10:30 AM – 12:00 AM,Thursday: 10:30 AM – 12:00 AM,Friday: 10:30 AM – 1:00 AM,Saturday: 10:30 AM – 1:00 AM,Sunday: 10:30 AM – 12:00 AM']

class RestaurantFactory(DjangoModelFactory):
    class Meta:
        model = Restaurant
        django_get_or_create = ('name','website','contact','address','latitude','longitude','business_status','operating_hours')
    name = ''
    website = ''
    contact = ''
    address = ''
    latitude = ''
    longitude = ''
    business_status = 'OPERATIONAL'
    operating_hours = random.choice(times)


for i in range(len(data)):
    try:
        if data[i]['website'].startswith(('http:///', 'https:///')):
            website = ''
        else:
            website = data[i]['website']    
        restaurant = RestaurantFactory(name=data[i]['name'],website=website, contact = data[i]['phone'],address = data[i]['address'], latitude=data[i]['lat'],longitude=data[i]['long'])
    except:
        print(data[i]['name'], " ", data[i]['address'], " ", data[i]['website']," ", data[i]['phone'], " ", data[i]['lat'], " ", data[i]['long'])
 
    
