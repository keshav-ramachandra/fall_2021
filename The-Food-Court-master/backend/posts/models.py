from django.db import models
from django.db.models.deletion import DO_NOTHING
from authentication.models import User
from django.core.validators import RegexValidator
from datetime import datetime

class Restaurant(models.Model):

    restaurant_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    website = models.CharField(max_length = 500, blank=True)
    phone_regex = RegexValidator(regex=r'^\d{9,15}$', message="Phone number must be entered in the format: '999999999'. From 9 to 15 digits allowed.")
    contact = models.CharField(validators=[phone_regex], max_length=15, blank=True) # validators should be a list
    is_active = models.BooleanField(default=True)
    address = models.CharField(max_length=500, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank = True, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, default=0.0)
    business_status = models.CharField(max_length = 20, blank=True, default='')
    operating_hours = models.CharField(max_length = 500, blank=True, default='')

    class Meta:
        unique_together = (('name', 'address'),)

    def __str__(self):
        return self.name + self.address

class FoodType(models.Model):

    food_type_id = models.AutoField(primary_key=True)
    food_type = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.food_type

class Post(models.Model):
    
    post_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    restaurant_id = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, null=True)
    food_image_url = models.ImageField(upload_to='posts/', null=True)
    approve_status = models.SmallIntegerField(default=0)

class SavedList(models.Model):

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    like_status = models.SmallIntegerField(default=1)
    
    class Meta:
        unique_together = ('user_id', 'post_id',) 

class FoodtypeTag(models.Model):

    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING, related_name='post_foodtype')
    foodtype = models.ForeignKey(FoodType, on_delete=models.DO_NOTHING, related_name='foodtype')

class FriendTag(models.Model):

    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING, related_name='post_friend_tagging')
    friend = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='tagged_friend')

class Sessions(models.Model):

    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_foodie_session_initiator')
    session_status = models.IntegerField(default=0)
    match_type = models.CharField(max_length=500, null=True)
    match_tag = models.CharField(max_length=500, null=True)
    is_end = models.BooleanField(default=False)    

class SessionUsers(models.Model):

    session = models.ForeignKey(Sessions, on_delete=models.CASCADE, related_name='group_foodie_session', null=True)
    sender_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='group_foodie_sender')
    receiver_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='group_foodie_invited_friend')
    status = models.IntegerField(default=0)
    is_end = models.BooleanField(default=False)

class SessionActivityRestaurant(models.Model):

    session = models.ForeignKey(Sessions, on_delete=models.CASCADE, related_name='session_reference_r')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='group_foodie_restaurant')
    liked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_foodie_like_r')

    class Meta:
        unique_together = ('session', 'restaurant', 'liked_by',)

class SessionActivityFoodType(models.Model):

    session = models.ForeignKey(Sessions, on_delete=models.CASCADE, related_name='session_reference_f')
    food_type = models.ForeignKey(FoodType, on_delete=models.CASCADE, related_name='group_foodie_foodtype')
    liked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_foodie_like_f')

    class Meta:
        unique_together = ('session', 'food_type', 'liked_by',)