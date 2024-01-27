from flask import Flask, jsonify, request
from category.analyticCategory import analyticCategory
app = Flask(__name__)

# Configuração para ambiente de desenvolvimento
app.config['ENV'] = 'development'
app.config['DEBUG'] = True


@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({'key': 'value'})


@app.route('/api/analyticCategory/<string:category>', methods=['GET'])
def searchCategory(category):
    print(category)
    data = analyticCategory.requestNews(category)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
