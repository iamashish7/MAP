import joblib 
import sys
import json
import xgboost as xgb
from sklearn.cluster import KMeans
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression


'''
# Load the model from the file 
kmeans = joblib.load('/var/www/html/predict_models/Kmeans.pkl')  

reg_models = []
for i in range(6):
    reg_models.append(joblib.load('/var/www/html/predict_models/Log_reg'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

# print (sys.argv[1],sys.argv[2],sys.argv[3])
nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

test = [nodes*walltime/11520,QState['qstate'][queue]/5,QState['status']['R']/466]
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
print (predicted_wt)
'''
avg_queue_load = {'small':5,'medium':6,'large':8,'smallsb':3,'mediumsb':5}
output = ''

#For Linear Regression
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/code/predict_models/new/Linear/Kmeans.pkl')  

reg_models = []
for i in range(6):
    reg_models.append(joblib.load('/var/www/html/new/code/predict_models/new/Linear/LR_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/code/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])
# [8298112      19     355      32] [0 1 0 1]
maxx = np.asarray([8298112,19,355,32])
minn = np.asarray([0,1,0,1])
if(queue in QState['qstate'].keys()):
    test = [nodes*walltime,QState['qstate'][queue],QState['status']['R'],nodes]
else:
    test = [nodes*walltime,avg_queue_load[queue],QState['status']['R'],nodes]
test = (test-minn)/(maxx-minn)
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output = str(predicted_wt) + ';'

#For Logistic Regression
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/code/predict_models/new/Logistic/Kmeans.pkl')  

reg_models = []
for i in range(8):
    reg_models.append(joblib.load('/var/www/html/new/code/predict_models/new/Logistic/LogR_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/code/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

maxx = np.asarray([8298112,19,355,32])
minn = np.asarray([0,1,0,1])
if(queue in QState['qstate'].keys()):
    test = [nodes*walltime,QState['qstate'][queue],QState['status']['R'],nodes]
else:
    test = [nodes*walltime,avg_queue_load[queue],QState['status']['R'],nodes]
test = (test-minn)/(maxx-minn)
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output = output + str(predicted_wt) + ';'

#For Decision Tree
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/code/predict_models/new/Decision_tree/Kmeans.pkl')  

reg_models = []
for i in range(6):
    reg_models.append(joblib.load('/var/www/html/new/code/predict_models/new/Decision_tree/dt_reg_'+str(i)+'.pkl'))
 
QState = {}
with open('/var/www/html/new/code/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

maxx = np.asarray([8298112,19,355,32])
minn = np.asarray([0,1,0,1])
if(queue in QState['qstate'].keys()):
    test = [nodes*walltime,QState['qstate'][queue],QState['status']['R'],nodes]
else:
    test = [nodes*walltime,avg_queue_load[queue],QState['status']['R'],nodes]
test = (test-minn)/(maxx-minn)
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict([test])[0]
output = output + str(predicted_wt) + ';'

#For XGB
# Load the model from the file 
kmeans = joblib.load('/var/www/html/new/code/predict_models/new/XGB/Kmeans.pkl')  

reg_models = []
for i in range(12):
    bst = xgb.XGBRegressor(silent=True)
    bst.load_model('/var/www/html/new/code/predict_models/new/XGB/XGB_reg_'+str(i)+'.model')
    reg_models.append(bst)
 
QState = {}
with open('/var/www/html/new/code/realtime/2010/QState.json','r') as fp:
    QState = json.load(fp)

nodes = int(sys.argv[1])
walltime = int(sys.argv[2])
queue = str(sys.argv[3])

maxx = np.asarray([8298112,19,355,32])
minn = np.asarray([0,1,0,1])
if(queue in QState['qstate'].keys()):
    test = [nodes*walltime,QState['qstate'][queue],QState['status']['R'],nodes]
else:
    test = [nodes*walltime,avg_queue_load[queue],QState['status']['R'],nodes]
test = (test-minn)/(maxx-minn)
predicted_cluster = kmeans.predict([test])[0]
predicted_wt = reg_models[predicted_cluster].predict(np.asarray([test]))[0]
output = output + str(predicted_wt)
print (output)
