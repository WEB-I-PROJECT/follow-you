from selenium import webdriver
from selenium.webdriver.common.by import By
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
    
    def format_url(self, uri: str, https = True):
        protocol = 'https' if https else 'http'
        return f"{protocol}://{self.domain}/{uri}"
    
    def login_in_instagram(self):
        self.access_page()
        
        time.sleep(3)
        
        self.driver.find_element(By.XPATH, '//input[@name="username"]').send_keys(self.username)
        
        time.sleep(1)
        
        self.driver.find_element(By.XPATH, '//input[@name="password"]').send_keys(self.password)
        
        time.sleep(1)
        
        self.driver.find_element(By.CSS_SELECTOR, '#loginForm [type="submit"]').click()
        
        time.sleep(10)

    def close(self):
        return self.driver.quit()

crawler = Crawler(username='followyou.official@gmail.com', password='#Followyou{2023}')
crawler.login_in_instagram()
