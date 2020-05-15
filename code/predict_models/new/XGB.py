'''
clustering using [node*hours, queue state, load, nodes, remaining node hours]
applying xgb on [node*hours, queue state, load, nodes]
'''
import pickle
import joblib
import time
from datetime import timedelta, date,datetime
import xgboost as xgb
import pymysql
import pymysql.cursors
#from datetime import timedelta, date
from sklearn.cluster import KMeans
import numpy as np
from sklearn.linear_model import LogisticRegression
import statistics
from pyclustering.cluster.elbow import elbow
#from pyclustering.cluster.kmeans import kmeans
from pyclustering.cluster.kmeans import kmeans_visualizer
from pyclustering.cluster.center_initializer import kmeans_plusplus_initializer
import heapq

idx = 0
no_clusters = 6
timee = 0
n_running = 0
n_queued = 0
job_data = {}
rem_nodehours = {}
wait_time = {}
run_time = {}

def GetMin(data):
    q = ''
    t = 10**10
    for key in data.keys():
        if(len(data[key])>0 and data[key][0][0]<t):
            t = data[key][0][0]
            q = key
    return q,t

def manageNodeHours(running):
    global timee,rem_nodehours
    for q in running.keys():
        for i in range(len(running[q])):
            rem_nodehours[q] -= running[q][i][7]*(timee-running[q][i][9])
            running[q][i][9] = timee
    
def moveRunning(running,qr):
    global n_running,timee,rem_nodehours
    temp = heapq.heappop(running[qr])
    rem_nodehours[temp[3]] -= temp[7]*(timee-temp[9])
    n_running -= 1
    timee = temp[0]

def moveQueued(queued,running,qq):
    global n_running,n_queued,timee,rem_nodehours
    temp = heapq.heappop(queued[qq])
    heapq.heappush(running[temp[3]],[temp[2],temp[0],temp[1],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8],temp[0]])
    rem_nodehours[temp[3]] += temp[6]
    n_queued -= 1
    n_running += 1
    timee = temp[0]

def moveSleeping(future_list):
    global n_queued,timee,job_data
    temp = heapq.heappop(future_list)
    heapq.heappush(queued[temp[3]],[temp[1],temp[0],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8]])
    n_queued += 1
    timee = temp[0]
    if temp[0] in load.keys():
        job_data[temp[4]] = [temp[6],len(queued[temp[3]]),load[temp[0]],temp[7]]
        #job_data[temp[4]] = [temp[6],len(queued[temp[3]]),load[temp[0]],temp[7],rem_nodehours[temp[3]]]
    else:
        job_data[temp[4]] = [temp[6],len(queued[temp[3]]),0,temp[7]]
        #job_data[temp[4]] = [temp[6],len(queued[temp[3]]),0,temp[7],rem_nodehours[temp[3]]]
    wait_time[temp[4]] = temp[5]

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

# Connect to Database
connection = pymysql.connect(host='localhost', user='ashish', passwd='ashish007',db='HPC_new2', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cur = connection.cursor()

#Computing load per day
load = {}
cur.execute("select id,jobid,start,end,`resource_list.nodect` as nodes from Master_E where id>0 and queue not like 'R%' and jobid not like '%[]%' and `resource_list.walltime` is not null and `resource_list.nodect` is not null and date>'2019-07-01'")
rows = cur.fetchall()

future_list = []
present_list = []
for i in range(len(rows)):
    #start_date = date(int(rows[i]['start'].split()[0].split('-')[0]), int(rows[i]['start'].split()[0].split('-')[1]), int(rows[i]['start'].split()[0].split('-')[2]))
    #end_date = date(int(rows[i]['end'].split()[0].split('-')[0]), int(rows[i]['end'].split()[0].split('-')[1]), int(rows[i]['end'].split()[0].split('-')[2]))
    start_date = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[i]['start'], '%Y-%m-%d %H:%M:%S'))).timestamp())
    end_date = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[i]['end'], '%Y-%m-%d %H:%M:%S'))).timestamp())
    #print (start_date,end_date)
    future_list.append([start_date,end_date, int(rows[i]['nodes']),int(rows[i]['id'])])


f_list = np.array(future_list)
start_date = min(f_list[:,0])
end_date = max(f_list[:,1])
heapq.heapify(future_list)
heapq.heapify(present_list)


load = {}
cpu_count = 0
for single_date in range(start_date, end_date):
    while(len(future_list)>0 and single_date == future_list[0][0]):
        temp = heapq.heappop(future_list)
        cpu_count = cpu_count + temp[2]
        heapq.heappush(present_list,[temp[1],temp[0],temp[2],temp[3]])
    
    while(len(present_list)>0 and single_date >= present_list[0][0]):
        temp = heapq.heappop(present_list)
        cpu_count = cpu_count - temp[2]
    load[single_date] = cpu_count


job_data = {}
queued = {}
running = {}
future_list = []
cur.execute("select distinct(queue) as q from Master_S order by queue")
rows = cur.fetchall()
no_queue = len(rows)
for i in range(len(rows)):
    queued[rows[i]['q']] = []
    running[rows[i]['q']] = []
    rem_nodehours[rows[i]['q']] = 0
    heapq.heapify(queued[rows[i]['q']])
    heapq.heapify(running[rows[i]['q']])

cur.execute("select id,jobid,queue,ctime as qtime,start,end,timestampdiff(second,ctime,start) as wtime,`resource_list.walltime` as rtime,`resources_used.walltime` as runtime,`resource_list.nodect` as nodes from Master_E where `resources_used.walltime` is not null and id>0 and jobid not like '%[]%' and queue not like 'R%' and `resource_list.walltime` is not null and timestampdiff(second,ctime,start)>=0 and date>'2019-07-01'")
rows = cur.fetchall()
for i in range(len(rows)):
    run_time[rows[i]['id']] = int(int(rows[i]['runtime'].split(':')[0])*3600 + int(rows[i]['runtime'].split(':')[1])*60 + int(rows[i]['runtime'].split(':')[2]))
    start_date = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[i]['start'], '%Y-%m-%d %H:%M:%S'))).timestamp())
    end_date = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[i]['end'], '%Y-%m-%d %H:%M:%S'))).timestamp())
    Qtime = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[i]['qtime'], '%Y-%m-%d %H:%M:%S'))).timestamp()) 
    future_list.append([Qtime,start_date,end_date,rows[i]['queue'],int(rows[i]['id']),int(rows[i]['wtime']),int(rows[i]['nodes'])*run_time[rows[i]['id']],int(rows[i]['nodes']),run_time[rows[i]['id']]])

heapq.heapify(future_list)

while(len(future_list)>0):
    qr,tr = GetMin(running)
    qq,tq = GetMin(queued)
    qs,ts = future_list[0][3],future_list[0][0]
    if(n_running>0):
        if(tr<min(tq,ts)):
            moveRunning(running,qr)
        elif(tq<min(tr,ts)):
            moveQueued(queued,running,qq)
        elif(ts<min(tr,tq)):
            moveSleeping(future_list)
        elif(ts==tr and tr==tq):
            moveRunning(running,qr)
            moveQueued(queued,running,qq)
            moveSleeping(future_list)
        else:
            if(ts==tr):
                moveRunning(running,qr)
                moveSleeping(future_list)
            elif(ts==tq):
                moveQueued(queued,running,qq)
                moveSleeping(future_list)
            elif(tr==tq):
                moveRunning(running,qr)
                moveQueued(queued,running,qq)
            else:
                pass
    elif(n_queued>0):
        if(tq<ts):
            moveQueued(queued,running,qq)
        elif(tq>ts):
            moveSleeping(future_list)    
        else:
            moveQueued(queued,running,qq)
            moveSleeping(future_list)
    else:
        moveSleeping(future_list)
    manageNodeHours(running)


map_jobid = {}
c = 0
for key in job_data.keys():
    map_jobid[c] = key
    c += 1


#Setting up training and testing data
X = np.array(list(job_data.values()))
job_data.clear()
load.clear()
rows.clear()
X_normed = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))
Y = np.array(list(wait_time.values()))
R = np.array(list(run_time.values()))
X_train,X_test = X_normed[:20000],X_normed[20000+1:60000]
Y_train, Y_test = Y[:20000], Y[20000+1:60000]
R_train, R_test = R[:20000], R[20000+1:60000]

#Applying ELBOW
elbow_instance = elbow(X_train, 1, 50)
elbow_instance.process()
amount_clusters = elbow_instance.get_amount()   # most probable amount of clusters
print (amount_clusters)
kmeans = KMeans(n_clusters=amount_clusters, random_state=0).fit(X_train)
joblib.dump(kmeans, 'XGB/Kmeans.pkl')
reg_models = []
for i in range(amount_clusters):
    x = X_train[kmeans.labels_==i]
    y = Y_train[kmeans.labels_==i]
    x = x[:,:4]
    reg = xgb.XGBRegressor(objective ='reg:squarederror', eval_metric='mae',colsample_bytree = 0.75, learning_rate = 0.01,max_depth = 7, alpha = 0.01, n_estimators = 50, min_child_weight = 7).fit(x, y)
    reg_models.append(reg)
    joblib.dump(reg, 'XGB/XGB_reg_'+str(i)+'.pkl')
    

#Predicting wtime for each job in test set   
PPE = []
AAE = []
#f = open("CTC_SP2_job_max_error_with_nodes_remload2.csv",'w')
#f.write('jobid,node_hours,queue_state,load,nodes,rem_nodeHours,predicted,actual,diff\n')
Last100 = []
for i in range(len(X_test)):
    predicted_cluster = kmeans.predict([X_test[i]])[0]
    predicted_wt = reg_models[predicted_cluster].predict(np.asarray([X_test[i][:4]]))[0]
    if (Y_test[i]+R_test[i]):
        PPE.append(abs(predicted_wt - Y_test[i])/(Y_test[i]+R_test[i]));
    AAE.append(abs(predicted_wt - Y_test[i]))
    if(i>(len(X_test)-101)):
        Last100.append([X_test[i],predicted_wt])
#    f.write(str(map_jobid[i+20001])+','+str(X_test_2[i][0])+','+str(X_test_2[i][1])+','+str(X_test_2[i][2])+','+str(X_test_2[i][3])+','+str(X_test_2[i][4])+','+str(predicted_wt)+','+str(Y_test[i])+','+str(abs(predicted_wt - Y_test[i]))+'\n')

print ("PPE : ",statistics.mean(PPE))
print ("AAE : ",statistics.mean(AAE)/3600)

with open('XGB/last100.data', 'wb') as filehandle:
    pickle.dump(Last100, filehandle)
