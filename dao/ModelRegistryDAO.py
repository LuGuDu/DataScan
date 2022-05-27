class ModelRegistryDAO:

    def save(self, modelRegistry, mongo):
        mongo.modelTrainHistorial.insert_one(modelRegistry)

    def getLastAttackList(self, mongo):
        mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["attack_list"]

    def getLastRegistry(self, mongo):
        mongo.modelTrainHistorial.find_one(sort=[("date", -1)])
    
    