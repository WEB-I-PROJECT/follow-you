from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

class Crawler():
    
    def __init__(self, username: str, password: str, window = True, domain='www.instagram.com') -> None:
        self.username = username
        self.password = password 
        self.domain = domain
        
        if window:
            self.driver = webdriver.Chrome()
        else:
            chrome_options = webdriver.chrome.options.Options()
            chrome_options.add_argument('--headless') 
            self.driver = webdriver.Chrome(options=chrome_options)
    
    def access_page(self, uri = ""):
         self.driver.get(self.format_url(uri))
         return True
    
    def element_content(self, xpath, bs4 = True):
        time.sleep(2)
        element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        
        if bs4:
            return BeautifulSoup(element.get_attribute('outerHTML'), "html.parser")
        return element.get_attribute('outerHTML')
        
    def page_html_content(self, bs4 = True):
        html_content = self.driver.page_source
        if bs4:
            return BeautifulSoup(str(html_content), "html.parser")
        return html_content
    
    def format_url(self, uri: str, https=True) -> str:
        protocol = 'https' if https else 'http'
        uri = uri[1:] if uri.startswith('/') else uri
        
        return f"{protocol}://{self.domain}/{uri}"

    def login_in_instagram(self, timeout=10):
        try:
            self.access_page()

            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((By.XPATH, '//input[@name="username"]'))
            ).send_keys(self.username)

            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((By.XPATH, '//input[@name="password"]'))
            ).send_keys(self.password)

            WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '#loginForm [type="submit"]'))
            ).click()

            return True
        except TimeoutException as e:
            print(f"Tempo limite de {timeout} segundos atingido durante o login.")
            return False
        except Exception as e:
            print(f"Ocorreu um erro durante o login: {e}")
            return False

    def close(self):
        return self.driver.quit()
    
    def request_page_by_xpath(self, xpath: str, timeout=10) -> bool:
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            element.click()
            return True
        except TimeoutException as e:
            print(f"Elemento não encontrado dentro do tempo limite de {timeout} segundos.")
            return False
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
        
# crawler = Crawler(username='followyou.official@gmail.com', password='#Followyou{2023}')
# crawler.login_in_instagram()
# crawler.access_page('follow.you_official/?next=%2F')