import sys
from news.cnn import CNNCrawler
from news.ig import IGrawler
from news.brasil_de_fato import BrasildeFatoCrawler
from news.cidade_verde import CidadeVerdeCrawler

if len(sys.argv) != 2:
    print("Usage: python script.py <ID>")
    sys.exit(1)

id = sys.argv[1]

crawlers = [
   CNNCrawler, BrasildeFatoCrawler, CidadeVerdeCrawler, IGrawler, 
   CNNCrawler, BrasildeFatoCrawler,  CidadeVerdeCrawler, IGrawler,
]

for Crawler in crawlers:
    crawler = Crawler(id)
    crawler.get_news()
    # print(crawler.get_news_partial())
    
