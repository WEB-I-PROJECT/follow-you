from pymongo import MongoClient
from mongo.models import Analytic
from bson import ObjectId

MONGO_ACCESS = "mongodb://localhost:27017/"
ANALYTIC_COLLECTION = 'analytics'
KEYWORD_GROUP_COLLECTION = 'keyword_groups'
NEWS_COLLECTION = 'news'

class analyticCategoryModels(Analytic):
    
    def __init__(self, _id) -> None:
        connect= MongoClient(MONGO_ACCESS)
        self.db = connect['hubnews']
        
        self.origin = ''
        self.analytic = self.db[ANALYTIC_COLLECTION].find_one({'_id': ObjectId(_id)})
        self.model = self.db[ANALYTIC_COLLECTION].find_one({'_id': ObjectId(_id)})
        self.keyword_groups =  self.db[KEYWORD_GROUP_COLLECTION].find({'analytic': ObjectId(_id)})
        self.news =  self.db[NEWS_COLLECTION]
    
    def insert_news(self,title, content, tags, date, origin, url, image):
        try:
            print(self.analytic.get('_id'))
            return self.news.insert_one({
                'title': title,
                'content': content,
                'tags': tags,
                'date': date,
                'origin': origin,
                'url': url,
                'image': image,
                'analytic': self.analytic.get('_id'),
            })
            
        except Exception as e:
            print(e)
            return None
