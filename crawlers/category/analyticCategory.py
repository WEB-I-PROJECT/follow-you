import datetime
import re
from bs4 import BeautifulSoup
import requests
from category.models_category import analyticCategoryModels

class analyticCategory():
    
    def requestNews(keyword):   
        data = {}
        try:
            url = 'https://www.cnnbrasil.com.br/?s='+keyword+'&orderby=date&order=desc'
            response = requests.get(url)
            data["CNN"] = []
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('a', class_='home__list__tag')
                
                for tags in articles:
                    picture = tags.find('picture')
                    img = picture.find('img')['src'] if picture and picture.find('img') else None
                    title = tags.get('title')
                    date = soup.find('span', 'home__title__date').getText()
                    link = tags.get('href')
                    data["CNN"].append({
                        'title': title,
                        'link': link,
                        'img_src': img,
                        'date': date,
                    })
                
        except Exception as error:
            print(error)
        
        try:
            url = 'https://search.folha.uol.com.br/?q='+keyword+'&site=todos'
            data["Folha"] = []
            response = requests.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('li', class_='c-headline--newslist')
                for tags in articles:
                    try:
                        img = tags.find('img', class_='c-headline__image')['src']
                        a = tags.find('div', class_='c-headline__content')
                        link = a.find('a')['href']
                        title_element = tags.find('h2', class_='c-headline__title')
                        title_text = title_element.get_text(strip=True) if title_element else "N/A"
                        sub_title = tags.find('p', 'c-headline__standfirst').getText()
                        date = tags.find('time', 'c-headline__dateline').getText()
                        data['Folha'].append({
                            'title': title_text,
                            'link': link,
                            'img_src': img,
                            'sub_title': sub_title,
                            'date': date,
                        })
                    except Exception as error:
                        print(error)
        except Exception as error:
            print(error)
            
        try:
            url = 'https://busca.ig.com.br/buscar/?q='+keyword
            
            data["IG"] = []
            response = requests.get(url)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                titles = soup.find_all('id', '379BB851-54D8-4EAF-913B-23C4471FCBC1')
                data['Folha'].append({
                    'title': titles
                })
                
        except Exception as error:
            print(error)            
        return data
    
    
    def get_content(data, analytic):
        try:
            dbNews = {}
            dbNews["CNN"] = []
            dbNews["Folha"] = []
            model_instance = analyticCategoryModels(analytic)
            for source, articles in data.items():
                for article in articles:
                    response = requests.get(article['link'])
                    if response.status_code == 200 and response.text.strip():
                        soup = BeautifulSoup(response.text, 'html.parser')
                        if source == 'CNN':
                            print(f"\n{source} News:")
                            try:
                                title = soup.find('h1', 'post__title').getText()
                                picture = soup.find('picture', 'img__destaque') 
                                img_src = picture.find('img')['src']
                                post_content = soup.find('div', 'post__content')
                                content = "\n".join([p.getText() for p in post_content.findAll('p')])
                                
                                if soup.find('span', 'post__data'): 
                                    date_match = re.search(r'\d{2}/\d{2}/\d{4} às \d{2}:\d{2}', soup.find('span', 'post__data').text) 
                                    date_string = date_match.group()
                                    date = datetime.datetime.strptime(date_string, '%d/%m/%Y às %H:%M')
                                else:
                                    date = None
                                    
                                tags_list = soup.find('ul', class_='tags__list')
                                tags = []
                                if tags_list:
                                    tag_items = tags_list.find_all('li', class_='tags__list__item')
                                    for tag_item in tag_items:
                                        tag = tag_item.find('a').text.strip()
                                        tags.append(tag)

                                model_instance.insert_news(
                                    title, 
                                    content, 
                                    tags, 
                                    date.strftime(' %Y-%m-%d %H:%M:%S '), 
                                    'cnn', 
                                    article['link'], 
                                    img_src, 
                                )
                            except Exception as e:
                                print(e)
                        elif source == 'Folha':
                            print(f"\n{source} News:")
                            try:
                                title = soup.find('h1', 'c-content-head__title').text.strip()                           
                                picture = soup.find('div', 'c-image-aspect-ratio c-image-aspect-ratio--3x2')
                                img_src = picture.find('img')['data-src']
                                post_content = soup.find('div', 'c-news__body')
                                content = "\n".join([p.getText() for p in post_content.findAll('p')])
                                date_string = soup.find('time', 'c-more-options__published-date')['datetime']
                                date = datetime.datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')
                                tags_list = soup.find('ul', class_='c-topics__list')
                                tags = []
                                if tags_list:
                                    tag_items = tags_list.find_all('li', class_='c-topics__item')
                                    for tag_item in tag_items:
                                        tag = tag_item.find('a').text.strip()
                                        tags.append(tag)

                                model_instance.insert_news(
                                    title,
                                    content,
                                    tags,
                                    date.strftime(' %Y-%m-%d %H:%M:%S '),
                                    'folha',
                                    article['link'],
                                    img_src,
                                )

                            except Exception as e:
                                print(e)
                        else:
                            print('não existe jornal com esse nome')
                    else:
                        return 'Erro no servidor, 500'
            return dbNews    
        except Exception as e:
            print(e)        