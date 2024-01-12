import time
from expansions.expansion import Expansion

class ExpansionByProfile(Expansion):
    def __init__(self, username: str, password: str, window=True, domain='www.instagram.com') -> None:
        super().__init__(username, password, window, domain)
       
    def access_list_followers(self): 
        return self.login_in_instagram() and \
            self.request_page(self.username, self.Pages.PROFILE) and \
            self.request_page(self.username, self.Pages.FOLLOWERS)
    
    def followers_uri(self):
        return self.get_list_of_users(
            self.element_content(self.Elements.DIV_FOLLOWERS.value)
        )
    
    def follow_users(self, uri: str):
        if(self.access_page(uri)):
            self.request_page(self.get_username_in_uri(uri), self.Pages.FOLLOWING)
            self.follow(self.Elements.BUTTON_FOLLOW.value)
            time.sleep(1)
            
    def run(self):
        if(self.access_list_followers()):
            for follower_uri in self.followers_uri():
                self.follow_users(follower_uri)
                