from web.crawler import Crawler

class FolhaSPCrawler(Crawler):
    url = 'https://search.folha.uol.com.br/?q='

    # Noticias no folha sp:
    # tag "a"  dentro tem uma tag h2 com class "c-headline__title"

    pass