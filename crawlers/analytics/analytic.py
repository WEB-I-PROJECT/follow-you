import json
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class verifyUser():

    def verifyUsername(self, username):
        #print(f"Entrando na função verifyUsername com o username: {username}")

        url = "https://www.instagram.com/" + username + "/"

        try:
            response = requests.get(url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                if soup.find('meta', property='og:type', attrs={'content': 'profile'}):

                    username_element = soup.find('meta', property='og:title')
                    nome_usuario = username_element["content"] if username_element else "Nome de usuário não encontrado"
                    profile_pic_element = soup.find(
                        'meta', property='og:image')
                    url_imagem_perfil = profile_pic_element[
                        "content"] if profile_pic_element else "URL da imagem de perfil não encontrada"

                    #print(f"Usuário encontrado: {nome_usuario}")
                    #print(f"URL da imagem de perfil: {url_imagem_perfil}")

                    data = {
                        'nome_usuario': nome_usuario,
                        'url_imagem_perfil': url_imagem_perfil,
                    }
                    
                    json_data = json.dumps(data)
                    
                    return json_data

                else:
                    print(
                        f"O usuário {username} não foi encontrado no Instagram.")
                    return False, f'O usuário {username} não foi encontrado no Instagram.'

            else:
                print(
                    f'Erro ao tentar acessar o perfil do Instagram. Código de status: {response.status_code}')
                return f'Erro ao tentar acessar o perfil do Instagram. Código de status: {response.status_code}'

        except requests.exceptions.RequestException as e:
            print(f'Erro na solicitação: {e}')
            return f'Erro na solicitação: {e}'

#verify = verifyUser()
#esult = verify.verifyUsername(username)

#print(result)


class analyticsByKeyword():
    
    def getKeyword(self, keyword):
        
        driver = webdriver.Chrome()
        
        driver.get('https://www.instagram.com/accounts/login/')
        
        time.sleep(2)
        usuario = "vanubia_teste"
        senha = "#Vanubia.Teste{2023}"
        driver.find_element(By.NAME, 'username').send_keys(usuario)
        driver.find_element(By.NAME, 'password').send_keys(senha)
        driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
        WebDriverWait(driver, 600).until(EC.url_contains('instagram.com'))
        
        home_page = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(
                (By.XPATH, "//div[@class='_ac8f']"))
        )
        driver.find_element(By.CLASS_NAME, "_ac8f").click()
        
        button = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "button._a9_1"))
        )
        
        button.click()      

        search = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "svg.x5n08af"))
        )
        search.click()

        # Aguarda a barra de pesquisa ficar disponível
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder="Pesquisar"]')))
        
        # Realiza uma pesquisa na barra de pesquisa do Instagram
        input_pesquisa = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder="Pesquisar"]'))
        )
        input_pesquisa.send_keys("#" + keyword)
        input_pesquisa.send_keys(Keys.RETURN)

        # Aguarda os resultados da pesquisa
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.v1Nh3')))

        # Aguarda os resultados da pesquisa
        time.sleep(5)

        # Obtém o conteúdo da página após a pesquisa
        page_source = driver.page_source

        # Utiliza o BeautifulSoup para analisar o conteúdo HTML
        soup = BeautifulSoup(page_source, 'html.parser')

        # Encontrar e extrair URLs das imagens
        imagens = soup.find_all('img', {'class': 'FFVAD'})
        urls_imagens = [img['src'] for img in imagens if 'src' in img.attrs]

        # Fecha o navegador
        #driver.quit()

        return urls_imagens
        
teste = analyticsByKeyword()
result = teste.getKeyword('Flamengo')
print(result)
        
        

