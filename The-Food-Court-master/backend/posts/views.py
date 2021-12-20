from django.db.models.expressions import F
from django.http.response import HttpResponse
from django.shortcuts import redirect, reverse
from django.http import JsonResponse
from django.views.decorators import csrf
from authentication.models import User
from posts.models import Restaurant, FoodType, Post, SavedList, FoodtypeTag, FriendTag, SessionUsers, Sessions, SessionActivityRestaurant, SessionActivityFoodType
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query_utils import Q
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from authentication.models import Friends, Notifications
from collections import OrderedDict
from rest_framework.views import APIView
from posts.serializers import PostImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
import json
from django.db import IntegrityError
from math import radians, sin, cos, atan2, sqrt
# from rest_framework import generics
# from django.core.files.storage import FileSystemStorage
# from posts.serializers import TestSerializer
import csv
import requests

@csrf_exempt
def get_posts(request):
    # print(request.GET.get('foodtag', None))
    rest_filter = request.GET.get('rest_filter', None)
    foodtag = request.GET.getlist('foodtag[]',None)
    location=request.GET.get('location', None)
    radius=request.GET.get('radius', None)
    checked=request.GET.get('checked',None)
    uemail = request.GET.get('user', None)
    # print(foodtag,"filllllllllllllll")
    recommended_posts = []
    recommendations=[]
    if checked=="second" and rest_filter!="{}":
        postlist = Post.objects.filter(approve_status=True,restaurant_id=int(json.loads(rest_filter)['id']))
        allposts = []
        # print(postlist)
        for i in postlist:
            food_res={}
            food_res['id'] = i.post_id
            food_res['name'] = i.restaurant_id.name
            images = Post.objects.filter(post_id=i.post_id).values()[0]
            food_res['image']= images['food_image_url']
            tag_types=(FoodtypeTag.objects.filter(post_id=i.post_id))
            # print(tag_types)
            food_res['user']=Post.objects.filter(post_id=i.post_id).first().user_id.user_name
            tag_types_list=[]
            for j in tag_types:
                tag_types_list.append(j.foodtype_id)
            tag_types_list=list(OrderedDict.fromkeys(tag_types_list))
            tag_list=[]
            for k in tag_types_list:
                tag_list.append(FoodType.objects.filter(food_type_id=k).first().food_type)
            food_res['tags']=tag_list
            food_res['operating_hours'] = Restaurant.objects.filter(name=i.restaurant_id.name).first().operating_hours

            try:
                lat=Restaurant.objects.filter(name=i.restaurant_id.name).first().latitude
                long=Restaurant.objects.filter(name=i.restaurant_id.name).first().longitude
                R = 6373.0
                
                lat1 = radians(lat)
                lon1 = radians(long)
                lat2 = radians(json.loads(location)["coords"]['latitude'])
                lon2 = radians(json.loads(location)["coords"]['longitude'])

                dlon = lon2 - lon1
                dlat = lat2 - lat1

                a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))

                distance = R * c * 0.621371
                food_res['dist']=round(distance,2) 
            except:
                pass

            allposts.append(food_res)
            # print(food_res['tags'],food_res['user'])
        return JsonResponse(allposts, safe=False)
    
    elif checked=="first" and foodtag!=[]:
        food_id_list=[]
        postid_list=[]
        # print(type(foodtag))
        for i in foodtag:
            food_id_list.append(FoodType.objects.get(food_type=json.loads(i)['item']))
        # print(food_id_list)
        for k in food_id_list:
            postid_list=FoodtypeTag.objects.filter(foodtype_id=k)
            # print(postid_list)
            postidlist=[]
            for m in postid_list:
                # print(m.post_id)
                if m.post_id not in postidlist:
                    postidlist.append(m.post_id)
            # print('pl', postidlist)
        postlist=[]
        for l in postidlist:
            postlist.append(Post.objects.filter(post_id=l,approve_status=True))
        allposts = []
        # print('pl2', postlist)
        for i in postlist:
            i = i[0]
            food_res={}
            food_res['id'] = i.post_id
            food_res['name']=i.restaurant_id.name
            images = Post.objects.filter(post_id=i.post_id).values()[0]
            food_res['image']= images['food_image_url']
            tag_types=(FoodtypeTag.objects.filter(post_id=i.post_id))
            # print(tag_types)
            food_res['user']=Post.objects.filter(post_id=i.post_id).first().user_id.user_name
            tag_types_list=[]
            for j in tag_types:
                tag_types_list.append(j.foodtype_id)
            tag_types_list=list(OrderedDict.fromkeys(tag_types_list))
            tag_list=[]
            for k in tag_types_list:
                tag_list.append(FoodType.objects.filter(food_type_id=k).first().food_type)
            food_res['tags']=tag_list
            food_res['operating_hours'] = Restaurant.objects.filter(name=i.restaurant_id.name).first().operating_hours
            
            try:
                lat=Restaurant.objects.filter(name=i.restaurant_id.name).first().latitude
                long=Restaurant.objects.filter(name=i.restaurant_id.name).first().longitude
                R = 6373.0
                
                lat1 = radians(lat)
                lon1 = radians(long)
                lat2 = radians(json.loads(location)["coords"]['latitude'])
                lon2 = radians(json.loads(location)["coords"]['longitude'])

                dlon = lon2 - lon1
                dlat = lat2 - lat1

                a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))

                distance = R * c * 0.621371
                food_res['dist']=round(distance,2) 
            except:
                pass

            allposts.append(food_res)
            # print(food_res['tags'],food_res['user'],"heeeeeelllll")
        return JsonResponse(allposts, safe=False)

    else:
        # print(location)
        minlat=json.loads(location)["coords"]['latitude']-1/69*int(radius)
        maxlat=json.loads(location)["coords"]['latitude']+1/69*int(radius)
        minlong=json.loads(location)['coords']['longitude']-1/69*int(radius)
        maxlong=json.loads(location)['coords']['longitude']+1/69*int(radius)
        # print('mmmm', minlat, maxlat, minlong, maxlong)
        rest=Restaurant.objects.all()
        rest_list=[]
        for i in rest:
            if (i.latitude>=minlat and i.latitude<=maxlat) and (i.longitude>=minlong and i.longitude<=maxlong):
                rest_list.append(i.restaurant_id)
        post_list=[]
        for i in rest_list:
            postlist = Post.objects.filter(approve_status=True,restaurant_id=i)
            for j in postlist:
                post_list.append(j)
        # print(post_list)
        allposts = []
        try:
            latest_saved_post_id = SavedList.objects.filter(user_id__email=uemail)[0].post_id
            food_type_tag = FoodtypeTag.objects.filter(post=latest_saved_post_id).first()
            food = food_type_tag.foodtype.food_type
            url = 'http://localhost:5000/predict_api?food={0}'.format(food)
            resp = requests.get(url)
            print("food recommendations are ", resp.json()["prediction"])
            recommendations = resp.json()["prediction"]
        except:
            print("no user or recommendations")
        for i in post_list:
            food_res={}
            food_res['id'] = i.post_id
            food_res['name']=i.restaurant_id.name
            lat=Restaurant.objects.filter(name=i.restaurant_id.name).first().latitude
            long=Restaurant.objects.filter(name=i.restaurant_id.name).first().longitude
            R = 6373.0
            
            lat1 = radians(lat)
            lon1 = radians(long)
            lat2 = radians(json.loads(location)["coords"]['latitude'])
            lon2 = radians(json.loads(location)["coords"]['longitude'])

            dlon = lon2 - lon1
            dlat = lat2 - lat1

            a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))

            distance = R * c * 0.621371
            food_res['dist']=round(distance,2) 
            # print(distance)
            images = Post.objects.filter(post_id=i.post_id).values()[0]
            food_res['image']=images['food_image_url']
            tag_types=(FoodtypeTag.objects.filter(post_id=i.post_id))
            # print(tag_types)
            food_res['user']=Post.objects.filter(post_id=i.post_id).first().user_id.user_name
            tag_types_list=[]
            for j in tag_types:
                tag_types_list.append(j.foodtype_id)
            tag_types_list=list(OrderedDict.fromkeys(tag_types_list))
            tag_list=[]
            for k in tag_types_list:
                tag_list.append(FoodType.objects.filter(food_type_id=k).first().food_type)
            match_tags = [x for x in recommendations if x in tag_list]
            food_res['tags']=tag_list
            food_res['operating_hours'] = Restaurant.objects.filter(name=i.restaurant_id.name).first().operating_hours
            match_tags = [x for x in recommendations if x in tag_list]
            if len(match_tags)>0:
                recommended_posts.append(food_res)
                print("matching tags are", match_tags)
            allposts.append(food_res)
            # print(food_res['operating_hours'])
        try:
            if len(recommended_posts) > 5:
                return JsonResponse(recommended_posts, safe = False)
        except:
            print("need at least 5 posts for recommendations")
        return JsonResponse(allposts, safe=False)
           
        
                
@csrf_exempt
def get_filtered_foodtypes(request):
    if request.method == 'GET':
        taggedtypes = FoodtypeTag.objects.all()
        foodtypes = set()
        for tag in taggedtypes:
            foodtypes.add(FoodType.objects.get(food_type_id=tag.foodtype.food_type_id, is_active=True).food_type)
        return JsonResponse(list(foodtypes),safe=False)

@csrf_exempt
def get_filtered_restaurants(request):
    taggedrest = Post.objects.filter(approve_status=True).values_list('restaurant_id', flat=True)
    tagrest = set(taggedrest)
    rest = Restaurant.objects.filter(is_active=True, restaurant_id__in=tagrest).values_list('restaurant_id', 'name', 'address')
    return JsonResponse(list(rest), safe=False)

@csrf_exempt
def get_saved_list(request):
    if request.method == 'GET':
        user_email = request.GET['user_email']
        users = User.objects.filter(Q(email=user_email))
        user_id = users[0].user_id
        saved_list = SavedList.objects.filter(Q(user_id_id=user_id, like_status=1))
        post_ids = [item.post_id_id for item in saved_list]
        post_list = Post.objects.filter(Q(post_id__in=post_ids))
        allposts = []
        for post in post_list:
            item = {}
            item['post_id'] = post.post_id
            item['profile'] = post.user_id.user_name
            item['restaurant'] = post.restaurant_id.name
            item['rest_url'] = post.restaurant_id.website
            images = Post.objects.filter(post_id=post.post_id).values()[0]
            item['image_url'] = images['food_image_url']
            foodtags = FoodtypeTag.objects.filter(post=post)
            if foodtags:
                tags = []
                for tag in foodtags:
                    tagname = FoodType.objects.get(food_type_id=tag.foodtype.food_type_id).food_type
                    tags.append(tagname)
                item['food_type'] = tags
            allposts.append(item)
        return JsonResponse(allposts, safe=False)

@csrf_exempt
def remove_saved(request):
    if request.method == 'GET':
        user_email = request.GET['user_id']
        users = User.objects.filter(Q(email=user_email))
        user_id = users[0].user_id
        post_id = request.GET['post_id']
        SavedList.objects.filter(Q(user_id_id=user_id, post_id=post_id)).delete()
        return redirect(reverse('get_saved_list') + '?user_email={}'.format(user_email))

@csrf_exempt
def add_saved(request):
    if request.method == 'GET':
        user_email = request.GET['user_email']
        users = User.objects.filter(Q(email=user_email))
        user_id = users[0].user_id
        post_id = request.GET['post_id']
        try:
            sl = SavedList.objects.create(
                user_id_id = user_id,
                post_id_id = post_id,
                like_status = 1
            )
            if sl:
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=401)
        except IntegrityError:
            sl = SavedList.objects.get(user_id_id = user_id, post_id_id = post_id, like_status = 2)
            sl.like_status = 1
            sl.save()
            return HttpResponse(status=200)
        except Exception as e:
            print(e)
            return HttpResponse(status=500)

@csrf_exempt
def left_swipe(request):
    if request.method == 'GET':
        user_email = request.GET['user_email']
        users = User.objects.filter(Q(email=user_email))
        user_id = users[0].user_id
        post_id = request.GET['post_id']
        try:
            sl = SavedList.objects.create(
                user_id_id = user_id,
                post_id_id = post_id,
                like_status = 2
            )
            if sl:
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=401)
        except IntegrityError:
            return HttpResponse(status=200)
        except Exception as e:
            print(e)
            return HttpResponse(status=500)

@csrf_exempt
def getFoodType(request):
    if request.method == 'GET':
        foodtype = FoodType.objects.filter(is_active=True).values_list('food_type', flat=True)
        return JsonResponse(list(foodtype),safe=False)

@csrf_exempt
def getRestaurant(request):
    # if request.method == 'GET':
    restname = Restaurant.objects.filter(is_active=True).values_list('restaurant_id', 'name', 'address')
    # print(restname)
    return JsonResponse(list(restname),safe=False)

@csrf_exempt
def getFriend(request):
    if request.method == 'GET':
        email=request.GET['user_email']
        users = User.objects.filter(Q(email=email))
        user_id = users[0].user_id
        fri=Friends.objects.filter(Q(request_status=True))
        friendList=[]
        for i in fri:
            if i.initiator_id==user_id:
                friendList.append(i.friend_id)
        friends=[]
        for i in friendList:
            u=User.objects.filter(Q(user_id=i)).first()
            friends.append(u.user_name)
        return JsonResponse(friends,safe=False)

@csrf_exempt
def getUsers(request):
    if request.method == 'GET':
        email = request.GET['email']
        user = User.objects.get(email=email)
        friendreqs = Friends.objects.filter(Q(request_status=True))
        friends = []
        for f in friendreqs:
            if f.initiator_id == user.user_id:
                friends.append(f.friend_id)
        friends.append(user.user_id)
        all = User.objects.all().exclude(user_id__in=friends)
        usernames = []
        for u in all:
            usernames.append(u.user_name)
        return JsonResponse(usernames, safe=False)

@csrf_exempt
@api_view(['POST'])
def savePost(request):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        try:
            post = Post.objects.create(
                user_id = User.objects.get(email=user_data['email']),
                restaurant_id = Restaurant.objects.get(restaurant_id =user_data['restaurant_name']['id'] ),
                # food_image_url = user_data['profile_photo_url']
            )
            
            if post:
                try:
                    if user_data['food_type']:
                        for i in user_data['food_type']:
                            ft = FoodtypeTag.objects.create(
                                post = post,
                                foodtype = FoodType.objects.get(food_type=i['item'])
                            )
                    if user_data['friend']:
                        for i in user_data['friend']:
                            fr = FriendTag.objects.create(
                                post = post,
                                friend = User.objects.get(user_name=i['item'])
                            )
                            notif = Notifications.objects.create(
                                type = 2,
                                receiver = User.objects.get(user_name=i['item']),
                                sender = User.objects.get(email=user_data['email'])
                            )                    
                except Exception as e:
                    print(e)
                    return HttpResponse(status=500)
            return JsonResponse(post.post_id, safe=False)
        except Exception as e:
            print(e)
            return HttpResponse('Post not added', status=500)
        
@csrf_exempt
def getIndvPosts(request):
    user_email = request.GET['user_email']
    users = User.objects.filter(Q(email=user_email))
    user_id = users[0].user_id
    posts = Post.objects.filter(Q(user_id_id=user_id, approve_status=True))
    pid_list=[]
    for post in posts:
        temp=post.post_id
        if temp not in pid_list:
            pid_list.append(temp)
    image_list=[]
    for pid in pid_list:
        images = Post.objects.filter(Q(post_id=pid, approve_status=True)).values()[0]
        image_list.append(images['food_image_url'])
    # print(image_list)
    return JsonResponse(image_list,safe=False)

@csrf_exempt
def getIndvTags(request):
    user_email = request.GET['user_email']
    users = User.objects.filter(Q(email=user_email))
    user_id = users[0].user_id
    posts = FriendTag.objects.filter(Q(friend=user_id))
    pid_list=[]
    for post in posts:
        temp=post.post_id
        if temp not in pid_list:
            pid_list.append(temp)
    image_list=[]
    for pid in pid_list:
        images = Post.objects.filter(Q(post_id=pid, approve_status=True)).values()[0]
        image_list.append(images['food_image_url'])
    return JsonResponse(image_list,safe=False)

@csrf_exempt
@api_view(['POST'])
def sendSessionInvite(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        initiator = data['initiator']
        friend = data['friend']
        init = User.objects.get(email=initiator)
        try:
            init_sess = Sessions.objects.filter(initiator=init, session_status__gte=0)
            if init_sess:
                return HttpResponse('Cannot create another session while one is already active', status=401)
        except:
            print('initiator can create new session')
        try:
            all_users_in_session = SessionUsers.objects.filter(status__gte=0)
            # print(all_users_in_session)
            send = set()
            recs = set()
            for session in all_users_in_session:
                send.add(session.sender_id_id)
                recs.add(session.receiver_id_id)
            # print(send, recs)
            if (init.user_id in send) or (init.user_id in recs):
                return HttpResponse('Cannot create another session while one is already active', status=401)
            # print('Initiator in no active sessions')
        except Exception as e:
            print(e)
            recs = set()
            send = set()
            # print('no active sessions')
        
        try:
            createsession = Sessions.objects.create(
                initiator = init,
                # started_at = datetime.now()
            )
            frnd=[]
            for i in friend:
                frnd.append(User.objects.get(user_name=i['item']))    
            notify=[]     
            for f in frnd:
                if (f.user_id in send) or (f.user_id in recs):
                    notify.append(f.user_name)
                else:
                    sessuser = SessionUsers.objects.create(
                        session = createsession,
                        sender_id = init,
                        receiver_id = f
                    )
                    notif = Notifications.objects.create(
                        type = 1,
                        receiver = f,
                        sender = init
                    )
                    if (not notif) or (not sessuser):
                        notify.append(f.user_name)
            print("frnd is",frnd)
            print("notify is", notify)
            n_rec = [f.user_name for f in frnd if f.user_name not in notify]
            print("notifiers are",n_rec)
            
            if len(notify)==0:
                print("i came first")
                return JsonResponse({'session_id': createsession.id , 'message': 'Session invite send to all','notifiers':json.dumps(n_rec)}, safe=False,status = 200)
            elif len(notify) < len(friend):
                failedlist=', '.join(notify)
                print("i also second")
                notifystring='Session invite failed for ' + failedlist + ' as they may be in another active session.'
                return JsonResponse({'session_id': createsession.id , 'message': notifystring,'notifiers':json.dumps(n_rec)}, safe=False,status = 200)
            elif len(notify) == len(friend):
                createsession.delete()
                return HttpResponse('No invites sent. Everyone is busy', status=400)
        except:
            return HttpResponse("Session couldn't be created", status = 500)

@csrf_exempt
def get_invite_status(request):
    session_id = request.GET['session_id']
    try:
        session = Sessions.objects.get(id=session_id, session_status=0)
        all_users = SessionUsers.objects.filter(session=session, status__gte=-1)
        sender = session.initiator
        status = []
        for u in all_users:
            item = {}
            item['user_name'] = u.receiver_id.user_name
            item['status'] = u.status
            item['initiator'] = sender.email
            item['id'] = u.receiver_id.user_id
            status.append(item)
        item = {}
        item['user_name'] = sender.user_name
        item['status'] = 1
        item['initiator'] = sender.email
        item['id'] = sender.user_id
        status.append(item)
        return JsonResponse(status, safe=False)
    except Exception as e:
        print(e)
        return HttpResponse('An error occured', status=500)

@csrf_exempt
def accept_group_invite(request):
    notification_id = request.GET['notification_id']
    notif = Notifications.objects.get(id=notification_id)
    if notif.type == 1:
        try:
            rec = User.objects.get(email=notif.receiver)
            sen = User.objects.get(email=notif.sender)
        except:
            return HttpResponse('No such request exists', status=404)
        try:
            notif.status = 1
            notif.save()
            sessuser = SessionUsers.objects.get(sender_id=sen, receiver_id=rec, status=0)
            session_id = sessuser.session_id
            sessuser.status = 1
            sessuser.save()
            # print('invite accepted')
            # return redirect(reverse('get_notifications') + f'?user_email={notif.receiver}')
            return JsonResponse({'session_id': session_id}, safe=False)
        except:
            return HttpResponse('An error occured', status=500)

@csrf_exempt
def is_session_active(request):
    try:
        email = request.GET['initiator']
        user = User.objects.get(email=email)
    except:
        return HttpResponse('No session has been created', status=404)
    try:
        sess = Sessions.objects.get(initiator=user, session_status=0)
        if sess:
            return JsonResponse({'session_id': sess.id, 'status': 0, 'initiator': user.email}, safe=False)
    except Exception as e:
        print(e)
        try:
            sess = Sessions.objects.get(initiator=user, session_status=1)
            if sess:
                return JsonResponse({'session_id': sess.id, 'status': 1, 'initiator': user.email}, safe=False)
        except:
            try:
                sess = SessionUsers.objects.get(receiver_id=user, status=1)
                if sess:
                    try:
                        start = Sessions.objects.get(id=sess.session_id, session_status=1)
                        if start:
                            inituser = sess.sender_id.email
                            return JsonResponse({'session_id': sess.session.id, 'status': 1, 'initiator': inituser}, safe=False)
                    except:
                        inituser = sess.sender_id.email
                        return JsonResponse({'session_id': sess.session.id, 'status': 0, 'initiator': inituser}, safe=False)
            except:
                    return HttpResponse('No active sessions.', status=404)

@csrf_exempt
def is_session_started(request):
    session = request.GET['session_id']
    try:
        sess = Sessions.objects.get(id=session, session_status=1)
        if sess:
            return JsonResponse({'session_id': sess.id}, safe=False)
    except:
        return HttpResponse('Session not yet started', status=404)

@csrf_exempt
def decline_group_invite(request):
    notification_id = request.GET['notification_id']
    notif = Notifications.objects.get(id=notification_id)
    if notif.type == 1:
        try:
            rec = User.objects.get(email=notif.receiver)
            sen = User.objects.get(email=notif.sender)
        except:
            return HttpResponse('No such request exists', status=404)
        try:
            notif.status = 1
            notif.save()
            sessuser = SessionUsers.objects.get(sender_id=sen, receiver_id=rec, status=0)
            sessuser.status = -1
            sessuser.save()
            # print('invite declined')
            return redirect(reverse('get_notifications') + f'?user_email={notif.receiver}')
        except Exception as e:
            print(e)
            return HttpResponse('An error occured', status=500)

@csrf_exempt
def start_session(request):
    user_email = request.GET['user_email']
    user = User.objects.get(email=user_email)
    try:
        session = Sessions.objects.get(initiator=user, session_status=0)
    except:
        return HttpResponse('Only initiators can start the session', status=401)
    try:
        session.session_status = 1
        # session.started_at = datetime.now()
        session.save()
        all_session_users = SessionUsers.objects.filter(sender_id=user, session=session)
        for sessuser in all_session_users:
            if sessuser.status == 0:
                sessuser.status = -1
                sessuser.save()

                notif = Notifications.objects.get(type=1, receiver_id=sessuser.receiver_id, sender_id=user, status=0)
                notif.status = 1
                notif.save()
        return JsonResponse({'session_id': session.id}, safe=False)
    except Exception as e:
        print(e)
        return HttpResponse("Session couldn't be started", status=500)

@csrf_exempt
def end_session(request):
    user_email = request.GET['user_email']
    session_id = request.GET['session_id']
    user = User.objects.get(email=user_email)
    try:
        session = Sessions.objects.get(id=session_id, initiator=user, session_status=1)
    except Exception as e:
        print(e)
        return HttpResponse('Only initiators can stop the active sessions', status=401)
    try:
        session.session_status = -1
        session.save()
        notif = Notifications.objects.create(
            type = 4,
            receiver = session.initiator,
            sender = session.initiator
        )
        if notif:
            print('End session notification sent to initiator')
        all_session_users = SessionUsers.objects.filter(sender_id=user, session=session, status=1)
        for sessuser in all_session_users:
            sessuser.status = -1
            sessuser.save()
            notif = Notifications.objects.create(
                type = 4,
                receiver = sessuser.receiver_id,
                sender = session.initiator
            )
            if notif:
                print(f'End session notification sent to {sessuser.receiver_id.user_id}')
        return HttpResponse('Session ended', status=200)
    except Exception as e:
        print(e)
        return HttpResponse("Session couldn't be stopped", status=500)

@csrf_exempt
def group_foodie_remove_user(request):
    user_email = request.GET['user_email']
    remove = request.GET['remove_email']
    session_id = request.GET['session_id']
    init = User.objects.get(email=user_email)
    remuser = User.objects.get(user_name=remove)
    try:
        session = Sessions.objects.get(initiator=init, id=session_id, session_status__gte=0)
        removeuser = SessionUsers.objects.get(receiver_id=remuser, session=session)
        removeuser.status = -2
        removeuser.save()

        notif = Notifications.objects.get(type = 1, status = 0, receiver = remuser, sender = init)
        notif.status = 1
        notif.save()

        delnotif = Notifications.objects.create(
            type = 5,
            receiver = remuser,
            sender = init
        )
        return redirect(reverse('get_invite_status') + '?session_id={}'.format(session_id))
    except:
        return HttpResponse('You cannot remove the user from the session', status=401)

@csrf_exempt
def group_foodie_swipe(request):
    if request.method == 'GET':
        user_email = request.GET['user_email']
        session_id = request.GET['session_id']
        post_id = request.GET['post_id']
        is_end = request.GET.get('is_end', 0)
        user = User.objects.get(email=user_email)
        post = Post.objects.get(post_id=post_id)
        end = set()
        try:
            session = Sessions.objects.get(session_status=1, id=session_id)
            if is_end == '1':
                if session.initiator == user:
                    session.is_end = True
                    session.save()
                else:
                    su = SessionUsers.objects.get(session=session.id, status=1)
                    su.is_end = True
                    su.save()
            if session.is_end:
                end.add(session.initiator)
        except Exception as e:
            print(e)
            try:
                session = Sessions.objects.get(session_status=-1, id=session_id)
                res = {
                    'match_found': 1,
                    'type': session.match_type,
                    'tag': session.match_tag
                }
                return JsonResponse(res, safe=False)
            except Exception as e:
                print(e)
                return HttpResponse('No session found', status=500)
        try:
            all_session_users = SessionUsers.objects.filter(session=session.id, status=1)
            if len(all_session_users) > 0:
                all_users = []
                all_users.append(all_session_users[0].sender_id.user_id)
                for u in all_session_users:
                    all_users.append(u.receiver_id.user_id)
                    # print(u.is_end)
                    if u.is_end:
                        end.add(u)
                # print('swipe', end)
                if len(end) == len(all_session_users) + 1:
                    res = {
                            'match_found': 2,
                            'type': 'no',
                            'tag': ''
                        }
                    session.session_status = -1 
                    session.match_type = 'no'
                    session.match_tag = ''
                    session.save()
                    notif = Notifications.objects.create(
                            type = 6,
                            receiver = session.initiator,
                            sender = session.initiator,
                            message = f'No match has been found in the session initiated by {session.initiator.user_name}'
                        )
                    for sessuser in all_session_users:
                        sessuser.status = -1
                        sessuser.save()
                        notif = Notifications.objects.create(
                            type = 6,
                            receiver = sessuser.receiver_id,
                            sender = session.initiator,
                            message = f'No match has been found in the session initiated by {session.initiator.user_name}'
                        )
                    return JsonResponse(res, safe=False)

                if is_end == '1':
                    return HttpResponse(200)

                try:
                    gfr = SessionActivityRestaurant.objects.create(
                        session = session,
                        restaurant = post.restaurant_id,
                        liked_by = user
                    )
                    if gfr:
                        # check match
                        liked_users = SessionActivityRestaurant.objects.filter(restaurant=post.restaurant_id, session=session)
                        # print('liked by', liked_users)
                        user_liked_rest = []
                        for u in liked_users:
                            user_liked_rest.append(u.liked_by.user_id)
                        # print(int(len(set(user_liked_rest)) == len(all_users)))
                        if len(set(user_liked_rest)) == len(all_users):
                            res = {
                                'match_found': int(len(set(user_liked_rest)) == len(all_users)),
                                'type': 'restaurant',
                                'tag': post.restaurant_id.name
                            }
                            try:
                                # print('restaurant match')
                                endsession = Sessions.objects.get(id=session.id, session_status=1)
                                endsession.session_status = -1
                                endsession.match_type = 'restaurant'
                                endsession.match_tag = post.restaurant_id.name
                                endsession.save()
                                notif = Notifications.objects.create(
                                        type = 3,
                                        receiver = endsession.initiator,
                                        sender = endsession.initiator,
                                        message = f'You have a restaurant match: {post.restaurant_id.name}'
                                    )
                                if notif:
                                    print('Notified initiator of restaurant match')
                                all_session_users = SessionUsers.objects.filter(sender_id=endsession.initiator_id, session=endsession, status=1)
                                for sessuser in all_session_users:
                                    sessuser.status = -1
                                    sessuser.save()

                                    notif = Notifications.objects.create(
                                        type = 3,
                                        receiver = sessuser.receiver_id,
                                        sender = endsession.initiator,
                                        message = f'You have a restaurant match: {post.restaurant_id.name}'
                                    )
                                    if notif:
                                        print(f'Notified user {sessuser.receiver_id.user_id} of restaurant match')
                                return JsonResponse(res, safe=False)
                            except Exception as e:
                                print(e)
                                return HttpResponse('An error occured in ending session after match was found', status=500)
                        else:
                            res = {
                                'match_found': int(len(set(user_liked_rest)) == len(all_users))
                            }
                            # return JsonResponse(res, safe=False)
                        
                except IntegrityError:
                    # no need to check match as no row was added and thus there is no change in table status
                    # print("don't add row, but still send OK response")
                    res = {
                        'match_found': 0
                    }
                    # return JsonResponse(res, safe=False)


                try:
                    foodtypes = FoodtypeTag.objects.filter(post=post)
                    for ft in foodtypes:
                        # print(ft)
                        try:
                            gff = SessionActivityFoodType.objects.create(
                                session = session,
                                food_type = ft.foodtype,
                                liked_by = user
                            )
                            if gff:
                                # check match
                                liked_users = SessionActivityFoodType.objects.filter(food_type=ft.foodtype, session=session)
                                # print('liked by', liked_users)
                                user_liked_rest = []
                                for u in liked_users:
                                    user_liked_rest.append(u.liked_by.user_id)
                                # print(int(len(set(user_liked_rest)) == len(all_users)))
                                if len(set(user_liked_rest)) == len(all_users):
                                    res = {
                                        'match_found': int(len(set(user_liked_rest)) == len(all_users)),
                                        'type': 'food type',
                                        'tag': ft.foodtype.food_type
                                    }
                                    try:
                                        # print('food type match')
                                        endsession = Sessions.objects.get(id=session.id, session_status=1)
                                        endsession.session_status = -1
                                        endsession.match_type = 'food type'
                                        endsession.match_tag = ft.foodtype.food_type
                                        endsession.save()
                                        notif = Notifications.objects.create(
                                                type = 3,
                                                receiver = endsession.initiator,
                                                sender = endsession.initiator,
                                                message = f'You have a food type match: {ft.foodtype.food_type}'
                                            )
                                        if notif:
                                            print('Notified initiator of food type match')
                                        all_session_users = SessionUsers.objects.filter(sender_id=endsession.initiator_id, session=endsession, status=1)
                                        for sessuser in all_session_users:
                                            sessuser.status = -1
                                            sessuser.save()
                                            notif = Notifications.objects.create(
                                                type = 3,
                                                receiver = sessuser.receiver_id,
                                                sender = endsession.initiator,
                                                message = f'You have a food type match: {ft.foodtype.food_type}'
                                            )
                                            if notif:
                                                print(f'Notified user {sessuser.receiver_id.user_id} of food type match')
                                        return JsonResponse(res, safe=False)
                                    except Exception as e:
                                        print(e)
                                        return HttpResponse('An error occured in ending session after match was found', status=500)
                            
                        except IntegrityError:
                            # no need to check match as no row was added and thus there is no change in table status
                            # print("don't add row, but still send OK response")
                            res = {
                                'match_found': 0
                            }
                            continue
                            # return JsonResponse(res, safe=False)

                except Exception as e:
                    print(e)
                    return HttpResponse('An error occured', status=500)

            else:
                res = {
                        'match_found': 0,
                        'type': 'no',
                        'tag': ''
                    }
                session.session_status = -1
                session.match_type = 'no'
                session.match_tag = ''
                session.save()
                notif = Notifications.objects.create(
                    type = 6,
                    receiver = session.initiator,
                    sender = session.initiator,
                    message = f'Session initiated by {session.initiator.user_name} has ended due to lack of users.'
                )
                return JsonResponse(res, safe=False)

        except Exception as e:
            print(e)
            return HttpResponse('An error occured', status=500)

        return HttpResponse(200)

@csrf_exempt
def group_foodie_left(request):
    if request.method == 'GET':
        user_email = request.GET['user_email']
        session_id = request.GET['session_id']
        is_end = request.GET.get('is_end', 0)
        user = User.objects.get(email=user_email)
        end = set()
        try:
            session = Sessions.objects.get(session_status=1, id=session_id)
            if is_end == '1':
                if session.initiator == user:
                    session.is_end = True
                    session.save()
                else:
                    su = SessionUsers.objects.get(session=session.id, receiver_id=user, status=1)
                    su.is_end = True
                    su.save()
            if session.is_end:
                end.add(session.initiator)
            session_users = SessionUsers.objects.filter(session=session.id, status=1)
            for su in session_users:
                if su.is_end:
                    end.add(su.receiver_id)
            # print('left', end)
            if len(end) == len(session_users) + 1:
                res = {
                        'match_found': 2,
                        'type': 'no',
                        'tag': ''
                    }
                session.session_status = -1
                session.match_type = 'no'
                session.match_tag = ''
                session.save()
                notif = Notifications.objects.create(
                    type = 6,
                    receiver = session.initiator,
                    sender = session.initiator,
                    message = f'No match has been found in the session initiated by {session.initiator.user_name}'
                )
                for sessuser in session_users:
                    sessuser.status = -1
                    sessuser.save()
                    notif = Notifications.objects.create(
                        type = 6,
                        receiver = sessuser.receiver_id,
                        sender = session.initiator,
                        message = f'No match has been found in the session initiated by {session.initiator.user_name}'
                    )
                return JsonResponse(res, safe=False)
            if len(session_users) == 0:
                res = {
                        'match_found': 0,
                        'type': 'no',
                        'tag': ''
                    }
                session.session_status = -1
                session.match_type = 'no'
                session.match_tag = ''
                session.save()
                notif = Notifications.objects.create(
                    type = 6,
                    receiver = session.initiator,
                    sender = session.initiator,
                    message = f'Session initiated by {session.initiator.user_name} has ended due to lack of users.'
                )
                return JsonResponse(res, safe=False)
            if session:
                return HttpResponse(status=200)
        except Exception as e:
            print(e)
            try:
                session = Sessions.objects.get(session_status=-1, id=session_id)
                res = {
                    'match_found': 1,
                    'type': session.match_type,
                    'tag': session.match_tag
                }
                return JsonResponse(res, safe=False)
            except Exception as e:
                print(e)
                return HttpResponse('Session ended', status=500)

class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        pass
        # posts = Test.objects.all()
        # serializer = PostImageSerializer(posts, many=True)
        # imgs = Test.objects.filter(id=1).values()[0]
        # return JsonResponse(imgs['image'], safe=False)

    def post(self, request, *args, **kwargs):
        posts_serializer = PostImageSerializer(data=request.data)
        post_id = request.data['post_id']
        # print(post_id)
        post = Post.objects.get(post_id=post_id)
        # print('user', post)
        # print(request.data['food_image_url'])
        try:
            posts_serializer.update(post, request.data)
            return HttpResponse('Update successful', status=201)
        except Exception as e:
            print('error', e)
            return HttpResponse('Update failed', status=400)
    

@csrf_exempt
def export_likes_csv(request):
    likes = SavedList.objects.all()
    response = HttpResponse('')
    response['Content-Disposition'] = 'attachment;filename=like_data.csv'
    writer = csv.writer(response)
    writer.writerow(['user_id', 'post_id', 'like'])
    likes = likes.values_list('user_id','post_id','like_status')
    for like in likes:
        writer.writerow(like)
    return response

@csrf_exempt
def export_foodtypes_csv(request):
    foods = FoodType.objects.all()
    response = HttpResponse('')
    response['Content-Disposition'] = 'attachment;filename=foodtypes.csv'
    writer = csv.writer(response)
    writer.writerow(['food_type_id', 'food_type'])
    foods = foods.values_list('food_type_id','food_type')
    for food in foods:
        writer.writerow(food)
    return response

@csrf_exempt
def export_foodtypetags_csv(request):
    tags = FoodtypeTag.objects.all()
    response = HttpResponse('')
    response['Content-Disposition'] = 'attachment;filename=foodtypetags.csv'
    writer = csv.writer(response)
    writer.writerow(['post_id', 'foodtype_id'])
    tags = tags.values_list('post_id','foodtype_id')
    for tag in tags:
        writer.writerow(tag)
    return response

@csrf_exempt
def export_posts_csv(request):
    posts = Post.objects.all()
    response = HttpResponse('')
    response['Content-Disposition'] = 'attachment;filename=posts_data.csv'
    writer = csv.writer(response)
    writer.writerow(['post_id', 'user_id'])
    posts = posts.values_list('post_id','user_id')
    for post in posts:
        writer.writerow(post)
    return response