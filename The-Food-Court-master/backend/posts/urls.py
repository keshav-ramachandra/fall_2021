from django.urls import path
from posts import views as post_views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('posts/get_saved_list', post_views.get_saved_list, name='get_saved_list'),
    path('posts/remove_saved', post_views.remove_saved, name='remove_saved'),
    path('posts/add_saved', post_views.add_saved, name='add_saved'),
    path('posts/left_swipe', post_views.left_swipe, name='left_swipe'),
    path('posts/get_posts', post_views.get_posts, name='get_posts'),
    path('posts/getFoodType', post_views.getFoodType, name='getFoodType'),
    path('posts/getRestaurant', post_views.getRestaurant, name='getRestaurant'),    
    path('posts/get_filtered_foodtypes', post_views.get_filtered_foodtypes, name='get_filtered_foodtypes'),
    path('posts/get_filtered_restaurants', post_views.get_filtered_restaurants, name='get_filtered_restaurants'),
    path('posts/savePost', post_views.savePost, name='savePost'),
    path('posts/getIndvPosts', post_views.getIndvPosts, name='getIndvPosts'),
    path('posts/getIndvTags', post_views.getIndvTags, name='getIndvTags'),
    path('posts/getFriend', post_views.getFriend, name='getFriend'),
    path('posts/getUsers', post_views.getUsers, name='getUsers'),
    path('posts/sendSessionInvite', post_views.sendSessionInvite, name='sendSessionInvite'),
    path('posts/upload_image', post_views.PostView.as_view(), name='upload_image'),
    path('posts/accept_group_invite', post_views.accept_group_invite, name='accept_group_invite'),
    path('posts/decline_group_invite', post_views.decline_group_invite, name='decline_group_invite'),
    path('posts/get_invite_status', post_views.get_invite_status, name='get_invite_status'),
    path('posts/start_session', post_views.start_session, name='start_session'),
    path('posts/end_session', post_views.end_session, name='end_session'),
    path('posts/group_foodie_swipe', post_views.group_foodie_swipe, name='group_foodie_swipe'),
    path('posts/group_foodie_left', post_views.group_foodie_left, name='group_foodie_left'),
    path('posts/is_session_active', post_views.is_session_active, name='is_session_active'),
    path('posts/is_session_started', post_views.is_session_started, name='is_session_started'),
    path('posts/group_foodie_remove_user', post_views.group_foodie_remove_user, name='group_foodie_remove_user'),
    path('posts/export/likes', post_views.export_likes_csv),
    path('posts/export/foodtype', post_views.export_foodtypes_csv),
    path('posts/export/foodtypetags', post_views.export_foodtypetags_csv),
    path('posts/export/posts', post_views.export_posts_csv),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)