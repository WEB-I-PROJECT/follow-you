from web.crawler import Crawler

class CNNCrawler(Crawler):
    # Noticias cnn:
    # tag "a"  com class "home__list__tag"
   
    def get_news(self):
        url = 'https://www.cnnbrasil.com.br/?s='
        self.get_keywords()

cnncrawler = CNNCrawler()
print(cnncrawler.get_news())