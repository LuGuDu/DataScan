from flask import Flask, request
import pandas as pd
import modules.mLMethods as ml

app = Flask(__name__)
mylist = None


@app.route('/api', methods=['GET'])
def index():
    return {"message" : 200}


@app.route('/train', methods=['POST'])
def entrenamiento():
    global mylist

    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            data = pd.read_csv(file)
            print(data.shape)
            print(data.columns)

            mylist = data['class']
            mylist = list(dict.fromkeys(sorted(mylist)))
            print(mylist)

            data = ml.cleanData(data)
            ml.train(data)

            return {"message" : 200}

    return {"message": 500}

    
if __name__ == '__main__':
    app.run()
