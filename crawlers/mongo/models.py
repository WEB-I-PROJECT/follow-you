from bs4 import BeautifulSoup
from bson import ObjectId
from pymongo import MongoClient
from web.crawler import Crawler

# '65b4fecb4acfe9eb522a1a06'
#no de vanúbia é 27018
MONGO_ACCESS = "mongodb://localhost:27017/"
ANALYTIC_COLLECTION = 'analytics'
KEYWORD_GROUP_COLLECTION = 'keyword_groups'
NEWS_COLLECTION = 'news'

class Analytic(Crawler):       
    def __init__(self, _id) -> None:
        connect= MongoClient(MONGO_ACCESS)
        self.db = connect['hubnews']
        
        self.origin = ''
        self.model = self.db[ANALYTIC_COLLECTION].find_one({'_id': ObjectId(_id)})
        self.keyword_groups =  self.db[KEYWORD_GROUP_COLLECTION].find({'analytic': ObjectId(_id)})
        self.news =  self.db[NEWS_COLLECTION]
        
    def insert_news(self, keyword_id, title, content, tags, date, url, image, keyword):
        try:
            return self.news.insert_one({
                'title': title,
                'content': content,
                'tags': tags,
                'date': date,
                'origin': self.origin,
                'url': url,
                'image': image,
                'keyword': keyword,
                'analytic': self.model.get('_id'),
                'keywordGroup': keyword_id
            })
        except Exception as e:
            print(e)
            return None
        
    def get_news_content(self, doc: BeautifulSoup):
        return doc.find(self.content.get('tag'), {'class': self.content.get('class')}).text
    
    def get_news_title(self, doc: BeautifulSoup):
        return doc.find(self.title.get('tag'), {'class': self.title.get('class')}).text
    
    def push_news(self, news_set: str, keyword_id, keyword: str):
        for news_link, image in  zip(news_set.get('news_links'), news_set.get('images')):
            try:
                doc = self.access_page(news_link)

                title = self.get_news_title(doc)
                content = self.get_news_content(doc)
                
                tags = []
                if self.tags:
                    tags = self.make_tags_list(
                        doc.find_all(self.tags.get('tag'), {'class': self.tags.get('class')})
                    )

                date = self.format_date(
                    doc.find(self.date.get('tag'), {'class': self.date.get('class')})
                )
                
                print(self.insert_news(
                    keyword_id, title, content, tags, date, news_link, image, keyword
                ), '\n')
            except Exception as e:
                print('\n-- ERROR:', e, '\n')
        
    def get_news(self):
        for keyword_group in self.keyword_groups:
            for keyword in keyword_group.get('keywords'):
                doc =  self.access_news_list(keyword)
                
                news_links = self.get_news_url(
                    self.news_link.get('class'),
                    doc
                )
                
                images_url = self.get_images(self.image.get('tag'), self.image.get('class'), doc)

                self.push_news({
                  'news_links': news_links,
                  'images': images_url  
                }, keyword_group.get('_id'), keyword)