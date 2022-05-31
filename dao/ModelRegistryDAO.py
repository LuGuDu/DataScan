class ModelRegistryDAO:

    def save(self, modelRegistry, mongo):
        mongo.modelTrainHistorial.insert_one(modelRegistry)

    def getLastAttackList(self, mongo):
        return mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["attack_list"]

    def getLastRegistry(self, mongo):
        return mongo.modelTrainHistorial.find_one(sort=[("date", -1)])

    def getAllRegistry(self, mongo):
        return mongo.modelTrainHistorial.find(sort=[("date", -1)])
    
    