from bs4 import BeautifulSoup
import requests
from requests_html import HTMLSession

class Crawler():       
    url = ''
    doc = BeautifulSoup()
    
    def access_page(self, url: str):
        print(url)
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return BeautifulSoup(response.text, 'html.parser')
            return None
        except Exception as e:
            return self.access_page(url)
            
    
    def access_news_list(self, keyword: str):
        _list = self.access_page(self.url + keyword)
        if(_list is None):
            return self.access_news_list(keyword)
        return _list
    
    def get_images(self, tag: str, reference: str, doc: BeautifulSoup) :
        imgs = doc.find(tag, {'class': reference}).find_all('img') if doc.find(tag, {'class': reference}) else []
        imgs_urls = [img.get('src') for img in imgs if img.get('src') is not None]
        return imgs_urls
        
    def get_news_url(self, reference: str, doc: BeautifulSoup):
        link_tags = doc.find_all('a', {'class': reference})
        urls = []
        
        for link_tag in link_tags:
            url = link_tag.get('href', '')
            if url:
                urls.append(url)
        
        return list(set(urls))
    
    def make_tags_list(self, _list):
        tags  = []
        if _list:
            for item in _list:
                tags.append(item.text.strip())
        return tags
    
    def make_tag_reference(self, tag, _class):
        return {
            'tag': tag,
            'class': _class
        }
        
class CrawlerImplicitWait():
    
    @staticmethod
    def access_page(url: str):
        print(url)
        session = HTMLSession()
        response = session.get(url)

        response.html.render(timeout=2, sleep=1)

        content = response.html.html
                
        return BeautifulSoup(content, 'html.parser')