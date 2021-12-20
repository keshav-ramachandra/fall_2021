from django.contrib import admin
from posts.models import Restaurant, FoodType, Post, SavedList, Sessions, SessionUsers, SessionActivityRestaurant, SessionActivityFoodType

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(FoodType)
admin.site.register(Post)
admin.site.register(SavedList)
admin.site.register(Sessions)
admin.site.register(SessionUsers)
admin.site.register(SessionActivityRestaurant)
admin.site.register(SessionActivityFoodType)