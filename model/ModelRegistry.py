"""Model class of ModelRegistry"""

class ModelRegistry:
    """Model class of ModelRegistry"""

    def __init__(self, training_file_name, date,
time_training, improved, accuracy, rows, columns, attack_list):
        """Constructor of a ModelRegistry"""
        self.training_file_name = training_file_name
        self.date = date
        self.time_training = time_training
        self.model_file_name = 'modeloEntrenado.pickle'
        self.improved = improved
        self.accuracy = accuracy
        self.rows = rows
        self.columns = columns
        self.attack_list = attack_list

    def get_json(self):
        """Returns a json with the instance info"""
        return {
            'trainingFileName': self.training_file_name,
            'date': self.date,
            'timeTraining': self.time_training,
            'modelFileName': self.model_file_name,
            'improved': self.improved,
            'accuracy': self.accuracy,
            'rows': self.rows,
            'columns': self.columns,
            'attack_list': self.attack_list
        }
