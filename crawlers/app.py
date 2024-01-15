from flask import Flask, jsonify, request
from typing import Self
from analytics.analytic import verifyUser
app = Flask(__name__)

# Configuração para ambiente de desenvolvimento
app.config['ENV'] = 'development'
app.config['DEBUG'] = True

@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({'key': 'value'})

#verificar username no insta - Luis
@app.route('/api/verifyUsername/<string:username>', methods=['GET'])
def verifyUsername(username):

    request = verifyUser.verifyUsername(Self, username)
    return jsonify(request)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
