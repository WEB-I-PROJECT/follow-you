import os
from flask import Flask, jsonify
from flasgger import Swagger
from category.analyticCategory import analyticCategory
from crontab import CronTab
from news.cnn import CNNCrawler
from news.ig import IGrawler
from news.brasil_de_fato import BrasildeFatoCrawler
from news.cidade_verde import CidadeVerdeCrawler

script_dir = os.path.dirname(os.path.abspath(__file__))
PATH_TO_CRON = os.path.join(script_dir, 'cron.py')
USER = 'junior'


def remove_all_cron_jobs():
    cron = CronTab(user=USER)
    cron.remove_all()
    cron.write()


def list_cron_jobs():
    cron = CronTab(user=USER)
    for job in cron:
        print(job)


def add_cron_job(command, schedule):
    cron = CronTab(user=USER)
    job = cron.new(command=command)
    job.setall(schedule)
    cron.write()


app = Flask(__name__)
Swagger(app)

app.config['ENV'] = 'development'
app.config['DEBUG'] = True


@app.route('/api/analytic/<string:id>/cron-group-keyword', methods=['POST'])
def execute_group_keywords(id):
    """
    Endpoint para executar um grupo de palavras-chave em uma tarefa cron.
    ---
    tags:
      - Analytic
    parameters:
      - name: id
        in: path
        type: string
        required: true
        description: ID do grupo de palavras-chave a ser executado
    responses:
      200:
        description: Sucesso ao criar a tarefa cron para web scraping
        content:
        application/json:
            schema:
            type: object
            properties:
                message:
                type: string
    """
    remove_all_cron_jobs()
    # Roda todo sabado de madrugada
    add_cron_job(f'python3 {PATH_TO_CRON} {id}', '0 0 * * 6')
    list_cron_jobs()
    return jsonify({'message': 'Web scraping cron created with success'})


@app.route('/api/analytic/cnn/<string:id>', methods=['GET'])
def newsCNN(id):
    """
    Endpoint para obter notícias da CNN
      ---
  tags:
    - Analytic
  parameters:
    - name: id
      in: path
      type: string
      required: true
      description: ID da notícia
  responses:
    200:
      description: Retorna as notícias parciais da CNN
      content:
        application/json:
          schema:
            type: object
            properties:
              news:
                type: array
                items:
                  type: object
                  properties:
                    date:
                      type: string
                    img:
                      type: string
                    title:
                      type: string
                    url:
                      type: string

    """
    return jsonify(CNNCrawler(id).get_news_partial())

# Defina endpoints para outros crawlers de notícias da mesma forma...


@app.route('/api/analyticCategory/<string:category>/<string:analytic>', methods=['GET'])
def searchCategory(category, analytic):
    """
    Endpoint para pesquisar em uma categoria de análise.
    ---
    tags:
      - Analytic
    parameters:
      - name: category
        in: path
        type: string
        required: true
        description: Categoria de análise
      - name: analytic
        in: path
        type: string
        required: true
        description: Análise específica a ser realizada
    responses:
      200:
        description: Retorna os dados da categoria de análise
    """
    data = analyticCategory.requestNews(category)
    analyticCategory.get_content(data, analytic)
    return jsonify(data)


@app.route('/api/analytic/cidade-verde/<string:id>', methods=['GET'])
def newsCidadeVerde(id):
    """
    tags:
      - Analytic
    Endpoint para obter notícias do Cidade Verde.
    ---
    tags:
      - Analytic
    parameters:
      - name: id
        in: path
        type: string
        required: true
        description: ID da notícia
    responses:
      200:
        description: Retorna as notícias parciais do Cidade Verde
        content:
          application/json:
            schema:
              type: object
              properties:
                news:
                  type: array
                  items:
                    type: object
                    properties:
                      date:
                        type: string
                      img:
                        type: string
                      title:
                        type: string
                      url:
                        type: string
    """
    return jsonify(CidadeVerdeCrawler(id).get_news_partial())


@app.route('/api/analytic/brasil-de-fato/<string:id>', methods=['GET'])
def newsBrasilDeFato(id):
    """
    Endpoint para obter notícias do Brasil de Fato.
    ---
    tags:
      - Analytic
    parameters:
      - name: id
        in: path
        type: string
        required: true
        description: ID da notícia
    responses:
      200:
        description: Retorna as notícias parciais do Brasil de Fato
        content:
          application/json:
            schema:
              type: object
              properties:
                news:
                  type: array
                  items:
                    type: object
                    properties:
                      date:
                        type: string
                      img:
                        type: string
                      title:
                        type: string
                      url:
                        type: string
    """
    return jsonify(BrasildeFatoCrawler(id).get_news_partial())


if __name__ == '__main__':
    app.run(debug=True, port=5001)
