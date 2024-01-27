from web.crawler import Crawler

class SoNoticiaBoaCrawler(Crawler):
    url= 'https://www.sonoticiaboa.com.br/search?term='

    # uma noticia no site Cidade Verde é caraterizada pelas teg html:
    # div com classe "class="mb-6 md:cursor-pointer" dentro dela  um teg figure 
    #(bem esquisita com os links) e dentro da div com a classe ....-pointer tem h3 que contem o coentudo do titulo
    pass