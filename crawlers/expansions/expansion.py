import re
import time
from bs4 import BeautifulSoup
from web.crawler import Crawler
from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Expansion(Crawler):
    
    class Elements(Enum):
        FOLLOWER_CLASS = '_aano'
        BUTTON_FOLLOW_CLASS = '_acan _acap _acas _aj1- _ap30'
        
        DIV_FOLLOWERS = f"//div[@class='{FOLLOWER_CLASS}']"
        
        BUTTON_FOLLOW = f'//button[contains(concat(" ", normalize-space(@class), " "), " {BUTTON_FOLLOW_CLASS} ")]'
    
    class Pages(Enum):        
        PROFILE = lambda username: f'//a[@href="/{username}/?next=%2F"]'
        FOLLOWERS = lambda username: f'//a[@href="/{username}/followers/?next=%2F"]'
        FOLLOWING = lambda username: f'//a[@href="/{username}/following/?next=%2F"]'

    def __init__(self, username: str, password: str, window=True, domain='www.instagram.com') -> None:
        super().__init__(username, password, window, domain)
        
    
    def request_page(self, username: str, option) -> bool:
        return self.request_page_by_xpath(option(username))
    
    def get_list_of_users(self, soup: BeautifulSoup, max_length=50) -> list:
        pattern = re.compile(r'/[\w.]+/\?next=%2F')
        divs = soup.find_all('div', {'class': '_aano'})
        
        hrefs = [ link.get('href') for link in divs[0].find('div').find_all('a', href=pattern)][:max_length] if divs else []
        
        return list(set(hrefs))
    
    def get_username_in_uri(self, uri: str) -> str:
        return uri.split('/')[1]
    
    def follow(self, option) -> None:
        time.sleep(2)
        buttons = self.driver.find_elements(By.XPATH, option)

        for button in buttons:
            button.click()
