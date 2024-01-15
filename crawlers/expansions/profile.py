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
            return self.follow(self.Elements.BUTTON_FOLLOW.value)
            
    def run(self):
        if(self.access_list_followers()):
            users_followeds = 0
            for follower_uri in self.followers_uri():
                users_followeds += self.follow_users(follower_uri)
                if users_followeds >= self.Numbers.MAX_FOLLOWERS_BY_DAY.value:
                    break
                
                print(users_followeds)
                print(f'PAUSA DE {self.Numbers.TIME_OF_BREAK.value} min')
                time.sleep(self.Numbers.TIME_OF_BREAK.value)
                
            return users_followeds