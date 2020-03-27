
import joblib 
import sys
import json


# # Load the model from the file 
# kmeans = joblib.load('/var/www/html/new/predict_models/Kmeans.pkl')  

# reg_models = []
# for i in range(6):
#     reg_models.append(joblib.load('/var/www/html/new/predict_models/Log_reg'+str(i)+'.pkl'))
 
# QState = {}
# with open('/var/www/html/new/realtime/2010/QState.json','r') as fp:
#     QState = json.load(fp)

# #print (sys.argv[1],sys.argv[2],sys.argv[3])
# nodes = int(sys.argv[1])
# walltime = int(sys.argv[2])
# queue = str(sys.argv[3])

# test = [nodes*walltime/11520,QState['qstate'][queue]/5,QState['status']['R']/466]
# predicted_cluster = kmeans.predict([test])[0]
# predicted_wt = reg_models[predicted_cluster].predict([test])[0]
# print (predicted_wt)

output = ''
#For XGB
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/predict_models/XGB/Kmeans.pkl')  

reg_models = []
for i in range(6):
    reg_models.append(joblib.load('/var/www/html/new/predict_models/XGB/XGB_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

test = [nodes*walltime,QState['qstate'][queue],QState['status']['R']]
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output = str(predicted_wt)

#For logistic
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/predict_models/LOGISTIC/Kmeans.pkl')  

reg_models = []
for i in range(5):
    reg_models.append(joblib.load('/var/www/html/new/predict_models/LOGISTIC/LOGISTIC_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

test = [nodes*walltime,QState['qstate'][queue],QState['status']['R']]
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output += str(predicted_wt)

#For Decision tree
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/predict_models/XGB/Kmeans.pkl')  

reg_models = []
for i in range(5):
    reg_models.append(joblib.load('/var/www/html/new/predict_models/XGB/DECISION_TREE_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

test = [nodes*walltime,QState['qstate'][queue],QState['status']['R']]
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output += str(predicted_wt)

print (output)