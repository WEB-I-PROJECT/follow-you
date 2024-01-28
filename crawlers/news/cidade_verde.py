from datetime import datetime

from bs4 import BeautifulSoup
from mongo.models import Analytic

class CidadeVerdeCrawler(Analytic):

    def __init__(self, _id) -> None:
        super().__init__(_id)
        self.url = 'https://cidadeverde.com/buscar/noticias/'
        self.origin = 'cidade-verde'
    
        self.news_link = self.make_tag_reference('a', 'news-item')
        
        self.urls = []
        self.title = self.make_tag_reference('h1', 'post-title')
        self.content = self.make_tag_reference('div', 'post-body')
        self.tags = self.make_tag_reference('a', '')
        self.date = self.make_tag_reference('p', 'post-date')
        self.image = self.make_tag_reference('div', 'post-body')
        
    def format_date(self, original_text: str):
        datetime_str = original_text.text

        datetime_str = datetime_str.replace(',', '')

        return datetime.strptime(datetime_str, "%d/%m/%y %H:%M")

    def make_tags_list(self, _list):
        tags  = []
        if _list:
            for item in _list:
                parent_classes = item.parent.get('class', [])
                if 'tags' in parent_classes:
                    tags.append(item.text)
        return tags
    
    def get_images(self, tag: str, reference: str, doc: BeautifulSoup) :
        print('Coletando imagens...')
        
        image_urls = []
        for url in self.urls:
            doc = self.access_page(url)
            img = doc.find(self.image.get('tag'), {'class': self.image.get('class')}).find('img')
            if img:
                image_urls.append(img.get('src'))
        return image_urls
    
    def get_news_url(self, reference: str, doc: BeautifulSoup):
        link_tags = doc.find('div', {'class':"ultimas clearfix"}).find_all('a')
        urls = []
        
        for link_tag in link_tags:
            url = link_tag.get('href', '')
            if url:
                urls.append(url)
        
        self.urls = list(set(urls))
        return list(set(urls))