from django.db import models
from datetime import datetime, date

from django.db.models.deletion import CASCADE, SET_DEFAULT
from django.db.models import constraints

class User(models.Model):

    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50, blank=True)
    dob = models.DateField(default=date(2000,1,1), blank=True)
    profile_photo_url = models.ImageField(upload_to='profile_pictures/', null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)
    last_login = models.DateTimeField(default=datetime.now)
    forget_pass_code = models.CharField(max_length=100, default='')
    expo_token = models.CharField(max_length=255, default='',blank=True)

    def __str__(self):
        return self.email


class FreemiumUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    device_id = models.CharField(max_length=255, unique = True)
    quota_done = models.BooleanField(default = False)

class Friends(models.Model):

    initiator = models.ForeignKey(User, on_delete=CASCADE, related_name='initiator')
    friend = models.ForeignKey(User, on_delete=CASCADE, related_name='friend')
    request_status = models.IntegerField(default=0)

    class Meta:
        constraints = [
            constraints.UniqueConstraint(
                fields=['initiator', 'friend'], name='unique_friendship_reverse'
             ),
            models.CheckConstraint(
                name='prevent_self_follow',
                check=~models.Q(initiator=models.F('friend')),
            )
        ]

    def save(self, *args, symmetric=True, **kwargs):
        if not self.pk:
            if symmetric:
                f = Friends(initiator=self.friend,
                            friend=self.initiator, 
                            request_status=self.request_status
                            )
                f.save(symmetric=False)
        else:
            if symmetric:
                f = Friends.objects.get(
                    initiator=self.friend, friend=self.initiator)
                f.request_status = self.request_status
                f.save(symmetric=False)
        return super().save(*args, **kwargs)

class Notifications(models.Model):

    type = models.IntegerField(default=0)
    receiver = models.ForeignKey(User, on_delete=CASCADE, related_name='receiver')
    status = models.BooleanField(default=False)
    sender = models.ForeignKey(User, on_delete=SET_DEFAULT, default=None, related_name='sender', null=True)
    timestamp = models.DateTimeField(default=datetime.now)
    message = models.CharField(max_length=500, null=True, blank=True)
