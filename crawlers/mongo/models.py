from mongoengine import Document, StringField, DateTimeField, IntField, ReferenceField, connect
import datetime

connect('followyou')

class InstagramAccount(Document):
    user_indentify = StringField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.now)
    url_img = StringField(required=True)
    initial_followers = IntField(required=True)
    actual_followers = IntField(required=True)
    user = ReferenceField('users', required=True)

    meta = {
        'collection': 'instagram_accounts'
    }
    