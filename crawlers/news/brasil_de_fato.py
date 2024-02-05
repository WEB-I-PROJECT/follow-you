from datetime import datetime
from bs4 import BeautifulSoup
from mongo.models import Analytic

class BrasildeFatoCrawler(Analytic):
    # uma noticia no site Brasil de Fato é caraterizada pelas teg html:
    # vig com classe "news-item-link divisor" com tag  "a"  com a class "news-item" e teg h3 com classe "title"
    def __init__(self, _id) -> None:
        super().__init__(_id)
        self.url= 'https://www.brasildefato.com.br/pesquisar?utf8=✓&q='

        self.origin = 'brasil-de-fato'
    
        self.news_link = self.make_tag_reference('a', 'news-item')
        
        self.title = self.make_tag_reference('h1', 'title')
        self.content = self.make_tag_reference('div', 'content')
        self.tags = []
        self.date = self.make_tag_reference('time', 'date')
        self.image = self.make_tag_reference('section', 'list')
        
    def format_date(self, original_text: str):
        datetime_str = original_text.get('datetime')

        datetime_str = datetime_str.replace(' -03', '')

        return datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S")

    def format_image_url(self, img):
        style_attribute = img.get('style', '')
        url_start_index = style_attribute.find('url(') + 4
        url_end_index = style_attribute.find(')', url_start_index)
        image_url = style_attribute[url_start_index:url_end_index]
        return image_url
    
    def get_images(self, tag: str, reference: str, doc: BeautifulSoup) :
        
        imgs = doc.find(tag, {'class': reference}).find_all('figure') if doc.find(tag, {'class': reference}) else []
        
        image_urls = []
        for img in imgs:
            image_urls.append(self.format_image_url(img))

        return image_urls
    
    def format_news(self, doc: BeautifulSoup):
        news_dict = []
        news = doc.find_all('div', {'class': 'news-item-link'})
        for new in news:
            news_dict.append({
                'title': new.find('h3', {'class': 'title'}).text,
                'date': new.find('time', {'class': 'date'}).text,
                'url': new.find('a', {'class': 'news-item'}).get('href'),
                'img': self.format_image_url(new.find('figure', {'itemprop': 'image'})),
            })
        return news_dict
        