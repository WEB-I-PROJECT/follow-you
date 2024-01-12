import re
import time
from bs4 import BeautifulSoup
from web.crawler import Crawler
from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

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
    
    def click_follow_button(self, followers_div, actions: ActionChains, option: str, max_clicks = 20, timeout = 10):
    
        clicks = 0
        while clicks < max_clicks:
            actions.move_to_element(followers_div).perform()

            self.driver.implicitly_wait(2)

            buttons = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_all_elements_located((By.XPATH, option))
            )

            for button in buttons:
                if clicks >= max_clicks:
                    break

                try:
                    button.click()
                    clicks += 1
                except Exception as e:
                    print(f"Failed to click button: {e}")

    
    def follow(self, option, timeout=10) -> None:
        try:
            followers_div = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.CLASS_NAME, self.Elements.FOLLOWER_CLASS.value))
            )
            
            actions = ActionChains(self.driver)
            
            self.click_follow_button(followers_div, actions, option)
            
        except Exception as e:
            print('Buttons of follow not found in this account')