from rest_framework import serializers
from authentication.models import User

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model =  User
        fields = ('user_name', 'email', 'password', )

class UpdateImageSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'email',
            'profile_photo_url',
        )
        model = User
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.profile_photo_url = validated_data.get('profile_photo_url', instance.profile_photo_url)
        instance.save()
        return instance


