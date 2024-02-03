from bs4 import BeautifulSoup
import requests


class analyticCategory():
    
    def requestNews(category):   
        data = {}
        
        try:
            url = 'https://www.cnnbrasil.com.br/?s='+category+'&orderby=date&order=desc'
            response = requests.get(url)
            data["CNN"] = []
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('a', class_='home__list__tag')
                
                for tags in articles:
                    picture = tags.find('picture')
                    img = picture.find('img')['src'] if picture and picture.find('img') else None
                    title = tags.get('title')
                    link = tags.get('href')
                    data["CNN"].append({
                        'title': title,
                        'link': link,
                        'img_src': img
                    })
                
        except Exception as error:
            print(error)
        
        try:
            url = 'https://search.folha.uol.com.br/?q='+category+'&site=todos'
            data["Folha"] = []
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('li', class_='c-headline--newslist')

                for tags in articles:
                    picture = tags.find('div', class_='c-masked-image--3x2')
                    link = picture.find('a')['href']
                    img = picture.find('img')['src']
                    
                    title_element = tags.find('h2', class_='c-headline__title')
                    title_text = title_element.get_text(strip=True) if title_element else "N/A"
                    
                    data['Folha'].append({
                        'title': title_text,
                        'img_src': img,
                        'link': link
                    })

        except Exception as error:
            print(error)
            
        try:
            url = 'https://busca.ig.com.br/buscar/?q='+category
            data["IG"] = []
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                titles = soup.find_all(
                    'h2', class_='destaque-item-link-ContentText-titulo')

                for title in titles:
                    data.append(title.text.strip())

        except Exception as error:
            print(error)            
          
        return data
                
