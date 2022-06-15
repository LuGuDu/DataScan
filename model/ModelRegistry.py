"""Model class of ModelRegistry"""

from operator import mod


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

    def get_training_file_name(self):
        """Returns the training file name"""
        return self.training_file_name

    def set_training_file_name(self, training_file_name):
        """Set the training file name value"""
        self.training_file_name = training_file_name

    def get_date(self):
        """Returns the date"""
        return self.date

    def set_date(self, date):
        """Set the date value"""
        self.date = date

    def get_time_training(self):
        """Returns the time training"""
        return self.time_training

    def set_time_training(self, time_training):
        """Set the time training value"""
        self.time_training = time_training

    def get_model_file_name(self):
        """Returns the model file name"""
        return self.model_file_name

    def set_model_file_name(self, model_file_name):
        """Set the model file name value"""
        self.model_file_name = model_file_name

    def get_improved(self):
        """Returns the improved value"""
        return self.improved

    def set_improved(self, improved):
        """Set the improved value"""
        self.improved = improved

    def get_accuracy(self):
        """Returns the accuracy"""
        return self.accuracy

    def set_accuracy(self, accuracy):
        """Set the accuracy value"""
        self.accuracy = accuracy

    def get_rows(self):
        """Returns the rows"""
        return self.rows

    def set_rows(self, rows):
        """Set the rows values"""
        self.rows = rows

    def get_columns(self):
        """Returns the columns"""
        return self.columns

    def set_columns(self, columns):
        """Set the columns values"""
        self.columns = columns

    def get_attack_list(self):
        """Returns the attack list"""
        return self.attack_list

    def set_attack_list(self, attack_list):
        """Set the attack list values"""
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
