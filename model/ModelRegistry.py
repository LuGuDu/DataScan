from numpy import column_stack


class ModelRegistry:

    def __init__(self, trainingFileName, date, timeTraining, improved, accuracy, rows, columns, attack_list):
        self.trainingFileName = trainingFileName
        self.date = date
        self.timeTraining = timeTraining
        self.modelFileName = 'modeloEntrenado.pickle'
        self.improved = improved
        self.accuracy = accuracy
        self.rows = rows
        self.columns = columns
        self.attack_list = attack_list

    def getJson(self):
        return {
            'trainingFileName': self.trainingFileName, 
            'date': self.date, 
            'timeTraining': self.timeTraining, 
            'modelFileName': self.modelFileName, 
            'improved': self.improved, 
            'accuracy': self.accuracy, 
            'rows': self.rows, 
            'columns': self.columns, 
            'attack_list': self.attack_list
        }
