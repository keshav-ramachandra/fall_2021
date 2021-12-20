from datetime import datetime
from django.contrib.auth import logout, login, authenticate
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from authentication.models import User
from posts.models import Restaurant, FoodType, Post, FoodtypeTag
from posts.serializers import RestaurantSerializer, FoodTypeSerializer
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.query_utils import Q
from rest_framework import status
from rest_framework.parsers import JSONParser
from adminconsole.serializers import UserSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
import random
import base64
from faker import Faker

FOOD_ID_FLAG = 0
RESTAURANT_ID_FLAG = 0


def index(request):
    return render(request, 'adminconsole/login.html', {})

def admin_home(request):
    if request.session['user']:
        return render(request, 'adminconsole/admin_home.html', {})
    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

def logout_request(request):
    request.session['user'] = None
    return redirect('/')

def super_admin_login(request):
    print("***************************FIRST LINE**************************************")
    if request.method == 'POST':
        request.session['user'] = None
        email = request.POST.get('email')
        password = request.POST.get('pwd')
        login_details = {}
        login_details['user_email'] = email
        ctx = {'login_details':login_details}
        user = User.objects.filter(Q(email=email, is_admin=1, is_superadmin=1))
        if user:
            serializer = UserSerializer(user, many=True)
            ser_user = dict(serializer.data[0])
            hashp = ser_user['password']
            if check_password(password, hashp):
                user[0].is_active = True
                user[0].last_login = datetime.now()
                user[0].save()
                request.session['user'] = user[0].email
                cur_admins = User.objects.filter(is_admin=True, is_superadmin = False)
                return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
            else:
                messages.error(request, "Invalid Password!")
                return render(request, "adminconsole/super_admin_login.html", ctx)
        else:
            messages.error(request, 'No such superadmin found')
            return render(request, "adminconsole/super_admin_login.html",  ctx)
    return render(request, "adminconsole/super_admin_login.html", {})
    

def admin_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('pwd')
        is_superadmin = request.POST.get('is_super')
        login_details = {}
        login_details['user_email'] = email
        ctx = {'login_details':login_details}

        if is_superadmin == "1":
            user = User.objects.filter(Q(email=email, is_admin=1, is_superadmin=1))
        else:
            user = User.objects.filter(Q(email=email, is_admin=1))
        if user:
            serializer = UserSerializer(user, many=True)
            ser_user = dict(serializer.data[0])
            hashp = ser_user['password']
            if check_password(password, hashp):
                user[0].is_active = True
                user[0].last_login = datetime.now()
                user[0].save()
                request.session['user'] = user[0].email
                return render(request, "adminconsole/admin_home.html", ctx)
            else:
                messages.error(request, "Invalid Password!")
                # print('password didnt match')
                return render(request, "adminconsole/login.html", ctx)
        else:
            messages.error(request, 'Email not found')
            return render(request, "adminconsole/login.html",  ctx)
    return render(request, "adminconsole/login.html", {})
    

# Code for Dummy Users Creation
fake = Faker()
def dummy_data_generator_user(request):
    for x in range(5):
        name = fake.name()
        f_user_name = name.replace(" ", "")
        f_first_name = name.split()[0]
        f_last_name = name.split()[-1]
        f_password = '12345678'
        f_phone_number = fake.random_number(digits=10, fix_len=True)
        f_dob = fake.date()
        f_email = f_first_name+"."+f_last_name+"@gmail.com"
        f_email = f_email.lower()
        user = User.objects.create(user_name = f_user_name, first_name = f_first_name, last_name=f_last_name, email=f_email, password = make_password(f_password), phone_number=f_phone_number, dob=f_dob, last_login = datetime.now())
        user.save()
    return HttpResponse("<html><body><h2> 10 Dummy Users Created </h2></body></html>")

# def fake_phone_number(fake: Faker) -> str:
#     return f'{fake.msisdn()[3:]}'


list_of_foods = ['French Fries', 'Ice Cream', 'Bread', 'Fried Rice', 'Pancakes', 'Pumpkin Pie',
'Chicken Pot Pie', 'Banana', 'Apple Pie','Bagel', 
'Chicken Curry', 'Boba Tea', 'Palak Paneer', 'Garlic Naan', 'Paneer Makhanwala', 'Chicken 65', 
'Spaghetti Bolognese', 'Bolognia', 'Ham and Cheese Bagel', 'Caesar Salad']

def dummy_data_generator_food(request):
    for x in range(10):
        n = random.randint(1,len(list_of_foods))
        food = FoodType.objects.filter(food_type=list_of_foods[n-1])
        if not food:
            FoodType.objects.create(food_type = list_of_foods[n-1])
        else:
            continue
    return HttpResponse("<html><body><h2> 10 Dummy Foods Created </h2></body></html>")

list_of_restos = ['Chili\'s Bar and Grill' , 'Shango New Orleans', 'SATO Ramen', 'Holy Feast', 'Kalypso Restaurant', 'Tandoori Hut',
'Burger Authority', 'Jim\'s Steakout', 'Venus','SZND', 
'Kostas Family Restaurant', 'Howling Rooster', 'Wendy\'s', 'Frank Gourmet Hotdogs', 'Curry\'s', 'Sinatra\'s', 
'Family Tree', 'China Star', 'Yummy Thai', 'Shawarma City']

def dummy_data_generator_restaurant(request):
    for x in range(10):
        n = random.randint(1,len(list_of_restos))
        if n == len(list_of_restos):
            n = n-1
        else:
            n = n
        f_name = list_of_restos[n]
        f_website = fake.url()
        f_contact = fake.random_number(digits=10, fix_len=True)
        f_address = fake.city()
        resto = Restaurant.objects.filter(name=f_name)
        if not resto:
            resto = Restaurant.objects.create(name = f_name, website = f_website, contact = f_contact, address = f_address)
        else:
            continue
    return HttpResponse("<html><body><h2> 10 Dummy Restaurants Created </h2></body></html>")

list_of_food_img_urls = [
    'https://images.unsplash.com/photo-1634487360040-e061298046be?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=415&q=80',

'https://images.unsplash.com/photo-1634487359989-3e90c9432133?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8eGpQUjRobGtCR0F8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1634481570432-0985738f83a1?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
'https://images.unsplash.com/photo-1634513760358-849d427caaad?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDI1fHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1634118520179-0c78b72df69a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80',

'https://images.unsplash.com/photo-1633896949673-1eb9d131a9b4?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDU4fHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1626711934535-9749ea30dba8?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDYzfHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGl6emF8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9zYXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZG9zYXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1630851840633-f96999247032?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMGJpcnlhbml8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',

'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3BhZ2hldHRpfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'
]

# def dummy_data_generator_posts(request):
#     # restos = Restaurant.objects.all()
#     # foods_taggs = FoodType.objects.all()
#     # userss = User.objects.all()

#     # n = random.randint(1, len(list_of_food_img_urls))
#     # postss = Post.objects.all()
#     list_food_tags = FoodType.objects.raw('SELECT * FROM foodcourt.posts_foodtype')
#     for p in list_food_tags:
#         print(p.food_type_id, p.food_type)
#     # f_food_image_url = ""
#     # new_post = Post.objects.create(food_image_url = )


#     # for x in range(10):
#     #     n = random.randint(1,19)
#     #     f_name = list_of_restos[n]
#     #     f_website = fake.url()
#     #     f_contact = fake_phone_number(fake)
#     #     f_address = fake.city()
#     #     resto = Restaurant.objects.filter(name=f_name)
#     #     if not resto:
#     #         resto = Restaurant.objects.create(name = f_name, website = f_website, contact = f_contact, address = f_address)
#     #     else:
#     #         continue
#     return HttpResponse("<html><body><h2> Hi </h2></body></html>")


def remove_admin(request):
    admin_email = request.GET['email']
    try:
        User.objects.filter(email=admin_email).first().delete()
        messages.success(request, 'Admin was deleted')
        return redirect('/admin_register')
    except:
        messages.info(request, 'Admin was not deleted')
        return redirect('/admin_register')

def admin_register(request):
    if request.session['user']:
        cur_admins = User.objects.filter(is_admin=True, is_superadmin = False)
        if request.method == 'POST':
            if request.session['user']:
                if request.method == 'POST':
                    username = request.POST.get('username')
                    email = request.POST.get('email')
                    password = request.POST.get('pwd')
                    is_already_app_user = User.objects.filter(email = email).first()
                    if is_already_app_user:
                        is_already_app_user.is_admin = True
                        is_already_app_user.save()
                        messages.error(request, 'This user has already registered on the app. So the same credentials were used for admin signup.')
                        return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
                    user_data = {'user_name':username, 'email':email, 'password':password }
                    user_ser = UserSerializer(data=user_data)
                    if user_ser.is_valid():
                        user = User.objects.create(
                            user_name = username,
                            email = email,
                            password = make_password(password),
                            is_admin = True,
                            last_login = datetime.now()
                        )
                        if user:
                            # login(request, user[0])
                            request.session['user'] = email

                            return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
                        else:
                            messages.error(request, 'User Registration Failed')
                            return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
                    messages.error(request, 'Invalid entry in form')
                    return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
                else:
                    return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})
            else:
                messages.error(request, 'You are not signed in!')
                return redirect('/')
        else:
            return render(request, 'adminconsole/signup.html', {'current_admins':cur_admins})

    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

        
def edit_restaurant_details(request):
    rt_id = request.GET['restaurant_id']
    global RESTAURANT_ID_FLAG
    if RESTAURANT_ID_FLAG == 0:
        RESTAURANT_ID_FLAG = rt_id
    rt_new = Restaurant.objects.filter(restaurant_id=RESTAURANT_ID_FLAG).first()
    ctx = {'resto_new' : rt_new}
    return render(request, "adminconsole/upload_restaurant.html", ctx)

def add_restaurant(request):
    global RESTAURANT_ID_FLAG
    if request.session['user']:
        if request.method == 'POST':
            rest_data = {}
            rest_data['name'] = request.POST.get('restaurant_name')
            rest_data['website'] = request.POST.get('restaurant_url')
            rest_data['contact'] = request.POST.get('restaurant_contact')
            rest_data['address'] = request.POST.get('restaurant_address')
            rest_data['latitude'] = request.POST.get('restaurant_latitude')
            rest_data['longitude'] = request.POST.get('restaurant_longitude')
            rest_data['business_status'] = request.POST.get('restaurant_status')
            rest_data['operating_hours'] = request.POST.get('restaurant_hours')
            print(rest_data)
            # if request.POST.get('restaurant_latitude') is not None:
            #     rest_data['latitude'] = request.POST.get('restaurant_latitude')
            # else:
            #     rest_data['latitude'] = 0.0

            # if request.POST.get('restaurant_longitude') is not None:
            #     rest_data['longitude'] = request.POST.get('restaurant_longitude')

            # else:
            #     rest_data['longitude'] = 0.0

            ctx = {'resto_new' : rest_data}
            if RESTAURANT_ID_FLAG != 0:
                r = Restaurant.objects.filter(restaurant_id=RESTAURANT_ID_FLAG).first()

                r.name = rest_data['name']
                r.website = rest_data['website']
                r.contact = rest_data['contact']
                r.address = rest_data['address']
                r.latitude = rest_data['latitude']
                r.longitude = rest_data['longitude']
                r.business_status = rest_data['business_status']
                r.operating_hours = rest_data['operating_hours']
                rest_serializer = RestaurantSerializer(data=rest_data)
                if rest_serializer.is_valid:
                    RESTAURANT_ID_FLAG = 0
                    messages.success(request, 'Restaurant details was modified')
                    r.save()
                    return redirect('/add_restaurant')
                else:
                    messages.info(request, 'Invalid entry')
                    return render(request, "adminconsole/upload_restaurant.html", ctx)
            else:
                rest_serializer = RestaurantSerializer(data=rest_data)
                if rest_serializer.is_valid():
                    # print("rest_serializer valid")
                    try:
                        rest = Restaurant.objects.create(
                            name = rest_data['name'],
                            website = rest_data['website'],
                            contact = rest_data['contact'],
                            address = rest_data['address'],
                            latitude = rest_data['latitude'],
                            longitude = rest_data['longitude'],
                            business_status = rest_data['business_status'],
                            operating_hours = rest_data['operating_hours'],
                            )
                        if rest:
                            rest.save()
                            messages.info(request, 'Restaurant added')
                            return redirect('/add_restaurant')
                        else:
                            messages.info(request, 'Error adding new restaurant')
                            return render(request, "adminconsole/upload_restaurant.html", ctx)
                    except:
                        # write an elegant way to inform user that error has occured
                        messages.info(request, 'Error in adding restaurant')
                        return render(request, "adminconsole/upload_restaurant.html", ctx)
                else:
                    add_errors = []
                    print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                    for key, value in rest_serializer.errors.items() :
                        print (key, value)
                    
                    # add_errors.append(rest_serializer.errors.name)
                    # add_errors.append(rest_serializer.errors.website)
                    # add_errors.append(rest_serializer.errors.contact)
                    # add_errors.append(rest_serializer.errors.address)
                    # add_errors.append(rest_serializer.errors.latitude)
                    # add_errors.append(rest_serializer.errors.longitude)
                    # all_errors = ' '.join(add_errors)
                    messages.info(request, 'Invalid Entries')
                    # messages.info(request, 'Invalid Entries: '+ all_errors)
                    return render(request, "adminconsole/upload_restaurant.html", ctx)
        existing_rest = Restaurant.objects.filter(is_active = True)
        return render(request, "adminconsole/upload_restaurant.html", {'restaurants': existing_rest})
    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

 
def edit_food_tag(request):
    ftid = request.GET['food_type_id']
    global FOOD_ID_FLAG
    if FOOD_ID_FLAG == 0:
        FOOD_ID_FLAG = ftid
    ft_new = FoodType.objects.filter(food_type_id=ftid).first()
    ctx = {'food_type_new': ft_new}
    return render(request, "adminconsole/upload_food.html", ctx)

def add_food_type(request):
    global FOOD_ID_FLAG
    if request.session['user']:
        if request.method == 'POST':
            food_type = {}
            food_type['food_type'] = request.POST.get('food_tag')
            # print(FOOD_ID_FLAG, "##############################")
            if FOOD_ID_FLAG != 0:
                f = FoodType.objects.filter(food_type_id = FOOD_ID_FLAG).first()
                f.food_type = food_type['food_type']
                ft_serializer = FoodTypeSerializer(data = food_type)
                if ft_serializer.is_valid():
                    f.save()
                else:
                    messages.error(request, 'Invalid Food type detected')
                    return redirect('/add_food_type')
                FOOD_ID_FLAG = 0
                # print(FOOD_ID_FLAG)
                messages.success(request, 'Food type was modified')
                return redirect('/add_food_type')
            else: 
                ft_serializer = FoodTypeSerializer(data=food_type)
                if ft_serializer.is_valid():
                    try:    
                        ft = FoodType.objects.create(
                            food_type = food_type['food_type'],
                            )
                        if ft:
                            messages.success(request, 'New food type added')
                            return redirect('/add_food_type')
                        else:
                            messages.info(request, 'Duplicate type was not added')
                            return redirect('/add_food_type')
                    except:
                        # write an elegant way to inform user that error has occured
                        messages.info(request, 'Invalid food type detected')
                        return redirect('/add_food_type')
                else:
                    messages.info(request, 'Invalid food type detected')
                    return redirect('/add_food_type')

        existing_tags = FoodType.objects.filter(is_active = True)
        return render(request, "adminconsole/upload_food.html", {'tags': existing_tags})
    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

def approve_images(request):
    if request.session['user']:

        allposts = []
        post_list = Post.objects.filter(approve_status=0)

        if post_list:
            for post in post_list:
                item = {}
                item['post_id'] = post.post_id        
                item['restoname'] = Restaurant.objects.filter(restaurant_id = post.restaurant_id_id).first().name
                item['user_name'] = User.objects.filter(user_id = post.user_id_id).first().user_name
                item['user_id'] = post.user_id_id
                item['tags'] = ""
                list_of_fids = []
                food_ids = FoodtypeTag.objects.filter(post_id = post.post_id)
                for f in food_ids:
                    list_of_fids.append(f.foodtype_id)
                list_of_ftags = []
                for fid in list_of_fids:
                    list_of_ftags.append(FoodType.objects.filter(food_type_id = fid).first().food_type)
                item['tags'] = ', '.join(list_of_ftags)
                # format, imgstr = post.food_image_url.split(';base64,') 
                # item['image'] = imgstr
                item['image'] = post.food_image_url
                print(item['image'])
                allposts.append(item)
            return render(request, "adminconsole/approve_images.html", {'current_posts': allposts})
        else:
            messages.info(request, 'No Posts Available')
            return render(request, "adminconsole/approve_images.html", {})
    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

def remove_tag(request):
    fid = request.GET['food_type_id']
    try:
        f = FoodType.objects.filter(food_type_id=fid).first()
        f.is_active = False
        f.save()
        messages.success(request, 'Food type was removed')
        return redirect('/add_food_type')
    except:
        messages.info(request, 'Food type was not removed')
        return redirect('/add_food_type')



def remove_restaurant(request):
    rid = request.GET['restaurant_id']
    try:
        r = Restaurant.objects.filter(restaurant_id=rid).first()
        r.is_active = False
        r.save()
        messages.success(request, 'Restaurant was removed')
        return redirect('/add_restaurant')
    except:
        messages.info(request, 'Restaurant was not removed')
        return redirect('/add_restaurant')

def approve_post(request):
    if request.session['user']:
        post_id = request.GET['post_id']
        try:
            print('before fetching specific post from db')
            post = Post.objects.filter(post_id=post_id).first()
            print('before updating post_status')
            post.approve_status = 1
            print('before saving that post')
            post.save()
            print('after post save')
            messages.success(request, 'Post Approved')
            return redirect('/approve_images')
        except:
            messages.info(request, 'Post could not be Approved')
            return redirect('/approve_images')
    else:
        messages.error(request, 'You are not signed in!')
        return redirect('/')

def discard_post(request):
    post_id = request.GET['post_id']
    try:
        post = Post.objects.filter(post_id=post_id).first()
        post.approve_status = -1
        user_id = post.user_id_id
        user1 = User.objects.filter(user_id = user_id).first()
        user_email = user1.email
        message = request.GET['discard_reason']
        print(message)
        send_mail(subject='Post discarded due to inappropriate content',message=message,from_email=settings.EMAIL_HOST_USER,recipient_list=[user_email])
        print('before saving post')
        post.save()
        print('after saving post')
        messages.success(request, 'Post Discarded')
        return redirect('/approve_images')
    except:
        messages.info(request, 'Post could not be Discarded')
        return redirect('/approve_images')