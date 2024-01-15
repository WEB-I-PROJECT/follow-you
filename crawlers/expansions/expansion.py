import re
import time
from bs4 import BeautifulSoup
from web.crawler import Crawler
from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import StaleElementReferenceException

class Expansion(Crawler):
    
    class Numbers(Enum):
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
    
    def click_follow_button(self, followers_div, actions: ActionChains, option: str, timeout = 10):
    
        clicks = 0
        while clicks < self.Numbers.MAX_FOLLOWERS_BY_BREAK.value:
        
            try:
                actions.move_to_element(followers_div).perform()
            except StaleElementReferenceException:
                print(f"Elemento tornou-se obsoleto. Tentando novamente...")

            buttons = []
            try:
                 buttons = WebDriverWait(self.driver, timeout).until(
                    EC.presence_of_all_elements_located((By.XPATH, option))
                )
            except Exception as e:
                print(e)

            for button in buttons:
                if clicks >= self.Numbers.MAX_FOLLOWERS_BY_BREAK.value:
                    break

                try:
                    button.click()
                    clicks += 1
                except Exception as e:
                    print(f"Failed to click button: {e}")
                    
        return clicks
    
    def follow(self, option, timeout=10) -> None:
        try:
            followers_div = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.CLASS_NAME, self.Elements.FOLLOWER_CLASS.value))
            )
            
            actions = ActionChains(self.driver)
            
            return self.click_follow_button(followers_div, actions, option)
            
        except Exception as e:
            print(e)
            print('Buttons of follow not found in this account')
            return 0
        
    def unfollow():
        pass