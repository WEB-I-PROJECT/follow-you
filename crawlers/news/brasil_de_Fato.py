from web.crawler import Crawler

class BrasildeFatoCrawler(Crawler):
    url = 'https://www.brasildefato.com.br/pesquisar?utf8=✓&q='

    # uma noticia no site Brasil de Fato é caraterizada pelas teg html:
    # vig com classe "news-item-link divisor" com tag  "a"  com a class "news-item" e teg h3 com classe "title"