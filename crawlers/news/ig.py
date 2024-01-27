from bs4 import BeautifulSoup
from mongo.models import Analytic
from datetime import datetime
from web.crawler import CrawlerImplicitWait

class IGrawler(Analytic):
    
    def __init__(self, _id) -> None:
        super().__init__(_id)
        self.url = 'https://busca.ig.com.br/buscar/?q='
        self.origin = 'ig'
    
        self.news_link = self.make_tag_reference('a', 'gs-title')
        
        self.title = self.make_tag_reference('h1', '')
        self.content = self.make_tag_reference('p', '')
        self.tags = self.make_tag_reference('a', 'tag-item')
        self.date = self.make_tag_reference('time', '')
        self.image = self.make_tag_reference('img', 'gs-image')
        
    def format_date(self, original_text: str):
        print(f"{original_text.text}")
        return datetime.strptime(f"{original_text.text}", "%d/%m/%Y %H:%M")
                
    def get_news_content(self, doc: BeautifulSoup):
        paragraphs = doc.find('div', {'id': 'noticia'})
        
        content = ''
        
        if paragraphs:
            for paragraph in paragraphs.find_all(self.content.get('tag')):
                content += ' ' + paragraph.text
            
        return content

    def get_news_title(self, doc: BeautifulSoup):
        title = doc.find(self.title.get('tag'), {'class': self.title.get('class')})
        if not title:
            return doc.find('h1').text
        return title.text
    
    def access_page(self, url: str):
       return CrawlerImplicitWait.access_page(url)
   

    def get_images(self, tag: str, reference: str, doc: BeautifulSoup):
        parent_links = doc.find_all('a', {'class': 'gs-image'})
        
        parent_links = [parent_link for parent_link in parent_links if parent_link.get('href') and 'ultimosegundo.ig.com.br' in parent_link.get('href')]
        
        imgs = [img for link in parent_links for img in link.find_all(tag, {'class': reference})]
        
        imgs_urls = [img.get('src') for img in imgs if img.get('src') is not None]
        
        return imgs_urls

    
    def get_news_url(self, reference: str, doc: BeautifulSoup):
        link_tags = doc.find_all('a', {'class': reference})
        urls = []
        
        domain = 'ultimosegundo.ig.com.br'

        for link_tag in link_tags:
            url = link_tag.get('href', '')
            if url and domain in url:
                urls.append(url)
                
        return list(set(urls))
    