from flask import Flask

app = Flask(__name__)
@app.route('/api', methods=['GET'])
def index():
    return {"message" : 200}
    
    
if __name__ == '__main__':
    app.run()
