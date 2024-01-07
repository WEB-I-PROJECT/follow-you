from flask import Flask, jsonify, request

app = Flask(__name__)

# Configuração para ambiente de desenvolvimento
app.config['ENV'] = 'development'
app.config['DEBUG'] = True

@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({'key': 'value'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
