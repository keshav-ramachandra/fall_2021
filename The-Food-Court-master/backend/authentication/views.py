from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import JSONParser
from authentication.models import User, FreemiumUser, Friends, Notifications
from authentication.serializers import UserSerializer, UpdateImageSerializer
from django.db.models.query_utils import Q
from django.core.mail import send_mail, BadHeaderError
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt 
from django.shortcuts import redirect, reverse
import random
import string
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
import csv

@csrf_exempt
@api_view(['POST'])
def register(request):
	user_data = JSONParser().parse(request)
	user_serializer = UserSerializer(data=user_data)
	if user_serializer.is_valid():
		user = User.objects.create(
			user_name = user_data['user_name'], 
			email = user_data['email'],
			password = make_password(user_data['password']),
			expo_token = user_data['expo_token']
			# phone_number = user_data['phone_number'],
			# dob = user_data['dob'],
			# last_login = datetime.now(),
			# profile_photo_url = user_data['profile_photo_url']
			)
		user.save()
		send_mail(subject='Food Court Registration',message='Thank you for Registering',from_email=settings.EMAIL_HOST_USER,recipient_list=[user_data['email']])
		return HttpResponse("Sign up successful", status=201)
	return HttpResponse(user_serializer.errors, status=400)

class postImage(APIView):
	parser_classes = (MultiPartParser, FormParser)

	def get(self, request, *args, **kwargs):
		pass
	# 	posts = Test.objects.all()
    #     serializer = UpdateImageSerializer(posts, many=True)
    #     imgs = Test.objects.filter(id=1).values()[0]
    #     return JsonResponse(imgs['image'], safe=False)
	
	def post(self, request, *args, **kwargs):
		serializer = UpdateImageSerializer(data=request.data)
		email = request.data['email']
		# print('data', request.data['email'])
		# print('email', email)
		user = User.objects.get(email=email)
		# print('user', user)
		# print(request.data['profile_photo_url'])
		try:
			serializer.update(user, request.data)
			return HttpResponse('Update successful', status=201)
		except Exception as e:
			print('error', e)
			return HttpResponse('Update failed', status=400)

@csrf_exempt
def get_user(request):
	user_email = request.GET['user_email']
	print(user_email)
	users = User.objects.filter(Q(email=user_email))
	# print(users)
	user_detail={}
	images = User.objects.filter(Q(email=user_email)).values()[0]
	# print(images)
	user_detail['user_name'] = users[0].user_name
	user_detail['first_name'] = users[0].first_name
	user_detail['last_name'] = users[0].last_name
	user_detail['phone_number'] = users[0].phone_number
	user_detail['profile_photo_url'] = images['profile_photo_url']
	user_detail['email'] = user_email
	# print(user_detail)
	return JsonResponse(user_detail, safe=False)

@csrf_exempt
@api_view(['POST'])
def update(request):
	user_data = JSONParser().parse(request)
	email = user_data['email']
	user = User.objects.filter(email= user_data['email']).first()
	user.first_name=user_data.get('first_name', None)
	user.last_name=user_data.get('last_name', None)
	user.user_name=user_data.get('user_name', None)
	user.phone_number=user_data.get('phone_number', None)
	try:
		user.save()
		# updated_user = User.objects.filter(email= user_data['email']).first()
		return redirect('/auth/get_user' + f'?user_email={email}')
		# return HttpResponse('User profile updated successfully',status=200)
	except:
		return HttpResponse("Username exists", status=500)

@csrf_exempt
@api_view(['POST'])
def login(request):
	data = JSONParser().parse(request)
	try:
		user = User.objects.filter(email= data['email']).first()
		if(check_password(data['password'], user.password)):
			user.last_login = datetime.now()
			user.is_active = True
			user.save()
			# request.session['user'] = user.email
			return HttpResponse('login success',status=200)
		else:
			return HttpResponse('login failure',status=401)
	except User.DoesNotExist:
		return HttpResponse("user not registered",status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['GET'])
def check_email(request):
	user_email = request.GET['user_email']
	try:
		user = User.objects.filter(email=user_email).first()
		if user:
			return HttpResponse('user exists',status=200)
		else:
			return HttpResponse("user doesn't exist",status=404)
	except User.DoesNotExist:
		return HttpResponse("user doesn't exist",status=404)

@csrf_exempt
@api_view(['GET'])
def check_username(request):
	user_name = request.GET['user_name']
	try:
		user = User.objects.filter(user_name=user_name).first()
		if user:
			return HttpResponse('username exists',status=200)
		else:
			return HttpResponse("username doesn't exist",status=404)
	except User.DoesNotExist:
		return HttpResponse("username doesn't exist",status=404)

def id_generator(size=11, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

@csrf_exempt
@api_view(['POST'])
def forgotPassword(request):
	data = JSONParser().parse(request)
	email = data['email']
	print(email)
	try:
		pass_code = id_generator()
		# print("pass", pass_code)
		user = User.objects.filter(email=email).first()
		user.forget_pass_code=pass_code
		user.save()
		subject = 'Food Court Change Password'
		html_message="<h1>Forgot your password?</h1><p>Please use the code "+pass_code+" to reset your password.</p>"
		from_email = settings.EMAIL_HOST_USER
		to = email
		send_mail(subject=subject, message='content', from_email = from_email , recipient_list=[to], html_message=html_message)
	except User.DoesNotExist:
		return HttpResponse("user not registered",status=status.HTTP_404_NOT_FOUND)
	return HttpResponse("success",status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['POST'])
def changePassword(request):
	user_data = JSONParser().parse(request)
	try:
		user_pass = User.objects.filter(email=user_data['email']).first().forget_pass_code
		if(user_pass != user_data['passcode'] or user_pass == ''):
			return HttpResponse("Link not valid",status=status.HTTP_404_NOT_FOUND)
		User.objects.filter(email=user_data['email']).update(password=make_password(user_data['password']), forget_pass_code='')
		return HttpResponse("password changed",status=status.HTTP_201_CREATED)
	except User.DoesNotExist:
		return HttpResponse("user not registered",status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
def change_password_edit(request):
	user_data = JSONParser().parse(request)
	try:
		user_pass = User.objects.filter(email=user_data['email']).first().password
		if(not check_password(user_data['passcode'], user_pass) or user_pass == ''):
			return HttpResponse("Can't change password. Old password incorrect",status=401)
		User.objects.filter(email=user_data['email']).update(password=make_password(user_data['password']), forget_pass_code='')
		return HttpResponse("Password changed",status=200)
	except User.DoesNotExist:
		return HttpResponse("User not registered",status=400)

@csrf_exempt
@api_view(['POST'])
def invite_user(request):
	data = JSONParser().parse(request)
	invitee = data['invitee']
	inviter = data['inviter']
	inv = User.objects.filter(email=inviter).first()
	user_name = inv.user_name
	newuser = User.objects.filter(email=invitee).first()
	if newuser:
		return HttpResponse('User already exists', status=404)
	try:
		send_mail(
		subject = 'Food Court Registration',
		message = f'Your friend {user_name} is inviting you to try The Food Court app',
		from_email=settings.EMAIL_HOST_USER,
		recipient_list=[invitee],
		fail_silently=False)
		return HttpResponse('Invite sent', status=200)
	except BadHeaderError:
		return HttpResponse('Invalid header found.', status=400)


@csrf_exempt
@api_view(['POST'])
def add_friend(request):
	data = JSONParser().parse(request)
	initiator = data['initiator']
	friend = data['friend']
	init = User.objects.get(email=initiator)
	try:
		frnd = User.objects.get(user_name=friend)
	except:
		return HttpResponse("No such user exists", status = 500)
	try:
		frnd_req = Friends.objects.create(
			initiator = init,
			friend = frnd
		)
		notif = Notifications.objects.create(
			type = 0,
			receiver = frnd,
			sender = init
		)
		if frnd_req and notif:
			return HttpResponse('Friend request sent', status = 200)
	except:
		return HttpResponse("You may already be friends!", status = 500)

@csrf_exempt
@api_view(['GET'])	
def accept_friend_request(request):
	notification_id = request.GET['notification_id']
	notif = Notifications.objects.filter(id=notification_id).first()
	# print(notif, notif.receiver, notif.sender)
	if notif.type == 0:
		try:
			rec = User.objects.get(email=notif.receiver)
			sen = User.objects.get(email=notif.sender)
			# print(rec, sen)
			req = Friends.objects.get(initiator=sen, friend = rec)
		except:
			return HttpResponse('No such friend request exists', status = 500)
		try:
			if req:
				req.request_status = 1
				# print(req.request_status)
				req.save()
				notif.status = 1
				# print(notif.status)
				notif.save()
				# return HttpResponse('Request Accepted', status = 200)
				return redirect(reverse('get_notifications') + '?user_email={}'.format(notif.receiver))
		except:
			return HttpResponse('An error has occured', status = 500)

@csrf_exempt
@api_view(['GET'])	
def decline_friend_request(request):
	notification_id = request.GET['notification_id']
	notif = Notifications.objects.filter(id=notification_id).first()
	# print(notif, notif.receiver, notif.sender)
	if notif.type == 0:
		try:
			rec = User.objects.get(email=notif.receiver)
			sen = User.objects.get(email=notif.sender)
			req = Friends.objects.get(initiator=sen, friend = rec)
			req2 = Friends.objects.get(initiator=rec, friend=sen)
		except:
			return HttpResponse('No such friend request exists', status = 500)
		try:
			if (req and req2):
				req.delete()
				req2.delete()
				# print(req.request_status)
				# req.save()
				notif.status = 1
				# print(notif.status)
				notif.save()
				# return HttpResponse('Request Accepted', status = 200)
				return redirect(reverse('get_notifications') + '?user_email={}'.format(notif.receiver))
		except:
			return HttpResponse('An error has occured', status = 500)

@csrf_exempt
@api_view(['GET'])	
def delete_friend(request):
	request_id = request.GET['request_id']
	user_email = request.GET['user_email']
	req = Friends.objects.filter(id=request_id).first()
	user1 = req.initiator_id
	user2 = req.friend_id
	try:
		rel1 = Friends.objects.filter(initiator_id=user1, friend_id=user2).first()
		rel2 = Friends.objects.filter(initiator_id=user2, friend_id=user1).first()
	except:
		return HttpResponse('Users not found', status=404)
	try:
		rel1.delete()
		rel2.delete()
		# return HttpResponse('Friend deleted', status = 200)
		return redirect(reverse('get_friends') + '?user_email={}'.format(user_email))
	except:
		return HttpResponse('An error has occured', status = 500)

@csrf_exempt
@api_view(['GET'])
def get_friends(request):
	email = request.GET['user_email']
	user = User.objects.get(email=email)
	all_requests = Friends.objects.filter(initiator=user, request_status=1)
	friend_requests = []
	for req in all_requests:
		item = {}
		item['id'] = req.id
		item['friend'] = User.objects.get(user_id=req.friend_id).user_name
		item['friend_email'] = User.objects.get(user_id=req.friend_id).email
		images = User.objects.filter(user_id=req.friend_id).values()[0]
		item['profile_photo_url'] = images['profile_photo_url']
		friend_requests.append(item)
	return JsonResponse(friend_requests, safe=False)

@csrf_exempt
@api_view(['GET'])
def get_notifications(request):
	email = request.GET['user_email']
	user = User.objects.get(email=email)
	all_requests = Notifications.objects.filter(receiver=user, status=False)
	types = ['friend request', 'group foodie invite', 'tagged you in a post', 'group foodie match', 'session ended', 'removed', 'no match']
	requests = []
	for req in all_requests:
		item = {}
		item['id'] = req.id
		item['type'] = types[req.type]
		item['sender'] = User.objects.get(user_id=req.sender_id).user_name
		ts = req.timestamp
		item['date'] = str(datetime.date(ts))
		item['time'] = str(datetime.time(ts)).split('.')[0]
		if req.message:
			item['message'] = req.message
		# item['friend_email'] = User.objects.get(user_id=req.friend_id).email
		requests.append(item)
	requests = sorted(requests, key= lambda x: (x['date'], x['time']), reverse=True)
	return JsonResponse(requests, safe=False)


def export_users_csv(request):
    users = User.objects.all()
    response = HttpResponse('')
    response['Content-Disposition'] = 'attachment;filename=users_data.csv'
    writer = csv.writer(response)
    writer.writerow(['user_id', 'first_name', 'last_name'])
    users = users.values_list('user_id','first_name','last_name')
    for user in users:
        writer.writerow(user)
    return response

@api_view(['POST','GET'])
def get_expo_ids(request):
    users = request.GET.getlist('users[]',None)
    print("users are ", users)
    expo_tokens = list(User.objects.filter(user_name__in = users).values_list('expo_token', flat=True))
    print("expo tokens are ",expo_tokens)
    return JsonResponse({"friends":list(expo_tokens)})
