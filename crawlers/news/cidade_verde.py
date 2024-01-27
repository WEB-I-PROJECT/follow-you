from web.crawler import Crawler

class CidadeVerdeCrawler(Crawler):

    url = 'https://cidadeverde.com/buscar/noticias/'

    # uma noticia no site Cidade Verde é caraterizada pelas teg html:
    # tag "h4"  com tag "a" dentro
    pass