from django.urls import path
from authentication import views as auth_views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/register',auth_views.register, name="auth_register"),
    path('auth/login', auth_views.login, name="auth_login"),
    path('auth/update', auth_views.update, name="auth_update"),
    path('auth/get_user', auth_views.get_user, name="auth_get_user"),
    path('auth/password_reset', auth_views.forgotPassword, name='password_reset_request'),
    path('auth/change_password', auth_views.changePassword, name='password_change_request'),
    path('auth/check_email', auth_views.check_email, name='check_email'),
    path('auth/check_username', auth_views.check_username, name='check_username'),
    path('auth/invite_user', auth_views.invite_user, name='invite_user'),
    path('auth/add_friend', auth_views.add_friend, name='add_friend'),
    path('auth/get_notifications', auth_views.get_notifications, name='get_notifications'),
    path('auth/get_friends', auth_views.get_friends, name='get_friends'),
    path('auth/accept_friend_request', auth_views.accept_friend_request, name='accept_friend_request'),
    path('auth/decline_friend_request', auth_views.decline_friend_request, name='decline_friend_request'),
    path('auth/delete_friend', auth_views.delete_friend, name='delete_friend'),
    path('auth/postImage', auth_views.postImage.as_view(), name='postImage'),
    path('auth/change_password_edit', auth_views.change_password_edit, name='change_password_edit'),
    path('auth/users/exportcsv', auth_views.export_users_csv),
    path('auth/get_expo_ids', auth_views.get_expo_ids)
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)