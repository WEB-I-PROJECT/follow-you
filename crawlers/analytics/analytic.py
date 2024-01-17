import json
import requests
from bs4 import BeautifulSoup
import sys  # Importe o módulo sys para acessar os argumentos da linha de comando


class verifyUser():

    def verifyUsername(username):
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

#username_from_node = sys.argv[1]
#verify = verifyUser()
#esult = verify.verifyUsername(username)

#print(result)

