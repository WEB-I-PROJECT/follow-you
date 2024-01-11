from expansions.expansion import Expansion
import time 

# ex = Expansion(username='follow.you_official', password='#Followyou{2023}')

ex = Expansion(username='vanubia_teste', password='@VanubiaTeste{2023]')

if( ex.login_in_instagram() and 
    ex.request_page(ex.username, ex.Pages.PROFILE) and
    ex.request_page(ex.username, ex.Pages.FOLLOWERS)):
    
    uris = ex.get_list_of_users(
        ex.element_content(ex.Elements.DIV_FOLLOWERS.value)
    )
    
    print(uris)
    for uri in uris:
       
       if(ex.access_page(uri)):
           
            ex.request_page(ex.get_username_in_uri(uri), ex.Pages.FOLLOWERS)
            ex.follow(ex.Elements.BUTTON_FOLLOW.value)
            time.sleep(5)
    
time.sleep(100)
    