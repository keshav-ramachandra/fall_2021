from django.contrib import admin
from authentication.models import User
from authentication.models import FreemiumUser
from authentication.models import Friends
from authentication.models import Notifications
# Register your models here.

admin.site.register(User)
admin.site.register(FreemiumUser)
admin.site.register(Friends)
admin.site.register(Notifications)