"""ModelRegistryDAO class"""

class ModelRegistryDAO:
    """Class with methods for model's registry persistance"""

    def save(self, model_registry, mongo):
        """Takes a model registry and save it on mongoDB"""
        mongo.modelTrainHistorial.insert_one(model_registry)

    def get_last_attack_list(self, mongo):
        """Returns the attack list of the last model registry on mongoDB"""
        return mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["attack_list"]

    def get_last_columns_list(self, mongo):
        """Returns the columns list of the last model registry on mongoDB"""
        return mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["columns"]

    def get_last_registry(self, mongo):
        """Returns the last model registry on mongoDB"""
        return mongo.modelTrainHistorial.find_one(sort=[("date", -1)])

    def get_all_registry(self, mongo):
        """Returns all model registries on mongoDB"""
        return mongo.modelTrainHistorial.find(sort=[("date", -1)])
 