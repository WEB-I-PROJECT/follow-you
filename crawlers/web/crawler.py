from pymongo import MongoClient
class Crawler():       
     
    def get_keywords(self):
        connect= MongoClient("mongodb://localhost:27017/")

        db = connect['hubnews']
        collection = db['keyword_groups']
        print(db)
        print(collection)


crawler = Crawler()
crawler.get_keywords()




