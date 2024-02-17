from flask import Flask, jsonify
from category.analyticCategory import analyticCategory
from crontab import CronTab
import os 
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

app.config['ENV'] = 'development'
app.config['DEBUG'] = True

 
@app.route('/api/analytic/<string:id>/cron-group-keyword', methods=['POST'])
def execute_group_keywords(id):
    remove_all_cron_jobs()
    # add_cron_job(f'python3 {PATH_TO_CRON} {id} >> {script_dir}/logfile.log 2>&1', '50 15 * * 6')

    add_cron_job(f'python3 {PATH_TO_CRON} {id}', '0 0 * * 6')  # Roda todo sabado de madrugada
    
    list_cron_jobs()
    
    return jsonify({
        'message': 'Web scrapping cron created with success'
    })

@app.route('/api/analytic/cnn/<string:id>', methods=['GET'])
def newsCNN(id):
    return jsonify(CNNCrawler(id).get_news_partial())

@app.route('/api/analytic/cidade-verde/<string:id>', methods=['GET'])
def newsCidadeVerde(id):
    return jsonify(CidadeVerdeCrawler(id).get_news_partial())

@app.route('/api/analytic/brasil-de-fato/<string:id>', methods=['GET'])
def newsBrasilDeFato(id):
    return jsonify(BrasildeFatoCrawler(id).get_news_partial())

@app.route('/api/analyticCategory/<string:category>', methods=['GET'])
def searchCategory(category):
    data = analyticCategory.requestNews(category)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)



