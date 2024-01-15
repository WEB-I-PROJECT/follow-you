import re
import time
from bs4 import BeautifulSoup
from web.crawler import Crawler
from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException, WebDriverException

class Expansion(Crawler):
    
    class Numbers(Enum):
        LIMIT_OF_SCROLLS_WITHOUT_FOLLOW = 20
        REST_BETWEEN_FOLLOWING = 5 # seg
        MAX_FOLLOWERS_BY_BREAK = 20
        MAX_FOLLOWERS_BY_DAY = 450
        TIME_OF_BREAK = 60 * 5 # 5 min
        
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
    
    def click_buttons(self, buttons, clicks):
        for button in buttons:
            if clicks >= self.Numbers.MAX_FOLLOWERS_BY_BREAK.value:
                break
            
            try:
                button.click()
                clicks += 1
                time.sleep(self.Numbers.REST_BETWEEN_FOLLOWING.value)
            except WebDriverException as e:
                print(f"Failed to click button: {e}")
        return clicks
        
    def get_follow_buttons(self, option, timeout=3):
        try:
           return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_all_elements_located((By.XPATH, option))
            )
        except TimeoutException:
            print(f"Timed out waiting for buttons with XPATH: {option}")
            return []
            
    def do_scroll(self):
        try:
            self.driver.execute_script("arguments[0].scrollTop += 100;", self.find_followers_div())
        except StaleElementReferenceException:
            print("Elemento tornou-se obsoleto. Tentando novamente...")
            
    def follow(self, option: str) -> int:
        clicks = 0
        scrolls_without_follow = 0

        try:
            while clicks < self.Numbers.MAX_FOLLOWERS_BY_BREAK.value:
                self.do_scroll()
                
                buttons = self.get_follow_buttons(option)
                
                if not buttons:
                    scrolls_without_follow += 1
                    
                if scrolls_without_follow >= self.Numbers.LIMIT_OF_SCROLLS_WITHOUT_FOLLOW.value:
                    break
                
                clicks = self.click_buttons(buttons, clicks)
               
        except Exception as e:
            print(f"Unexpected exception: {e}")
            
        return clicks

    def find_followers_div(self, timeout=10):
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.CLASS_NAME, self.Elements.FOLLOWER_CLASS.value))
            )
        except Exception as e:
            return None
        
    def unfollow():
        pass