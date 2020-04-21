"""

This python script is used to fill user data. 
abbr :
MFQ : Most frequent queue
AJSI : average job submission interval (means average time between two job submissions)
AWT : average wait time
AMU : average memory used
MUC : most used cluster
TJS : total jobs submitted
ANU : average nodes used per job
//CJNC : count of jobs per node count
FJ : Failed
CJ : completed jobs
"""
import time
import pymysql
import pymysql.cursors
import os
from datetime import datetime

database = "SavedLogs"
headers = []

## Connect to Database
connection = pymysql.connect(host='localhost', user='monalys', passwd='monalys', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
connection.select_db(database)
cursor = connection.cursor()


def setup():
    table = "create table if not exists user_profile_2010 (uid varchar(50),MFQ varchar(50) not null,AJSI double not null,AWT double not null,AMU double not null,MUC varchar(10) not null,TJS int not null,ANU double not null,FJ bigint not null,CJ bigint not null,PRIMARY KEY (uid));"
    cursor.execute(table)
    
def insertData(table_name,table):
    # print (table_name)
    columns = table.keys()
    # print (','.join(columns))
    values = table.values()
    # print (','.join(values))
    sql = "INSERT INTO {0}({1}) VALUES ({2})".format(table_name,','.join(columns),','.join(values))
    # print (sql)
    cursor.execute(sql)

def closeConnection():
    connection.commit()
    cursor.close()
    connection.close()
    
#setting up Database
setup()
cursor.execute("select distinct(uid) as u from HPC2010 where uid<>'NoUser' and queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb'")
user = cursor.fetchall()
for i in range(len(user)):
    data = {}
    data['uid'] = "'"+str(user[i]['u'])+"'"
    data['MFQ'] = []
    print (i,len(user))
    #MFQ
    sql = "select C.queue as Q ,C.c from (select max(c) as m from(select queue,count(*) as c from HPC2010 where queue not like 'R%' and uid = '"+ user[i]['u'] +"' and queue <> 'workq' and queue <> 'workqsb' group by queue) A) B, (select queue,count(*) as c from HPC2010 where queue not like 'R%' and uid = '" + user[i]['u'] + "' and queue <> 'workq' and queue <> 'workqsb' group by queue) C where C.c = B.m;";
    cursor.execute(sql)
    rows = cursor.fetchall()
    for j in range(len(rows)):
        data['MFQ'].append(rows[j]['Q']) 
    data['MFQ'] = "'"+','.join(data['MFQ'])+"'"

    #AJSI
    sql = "select stime from HPC2010 where uid= '"+ user[i]['u'] +"' and queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb' order by stime"
    cursor.execute(sql)
    rows = cursor.fetchall()
    prev = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[0]['stime'], '%Y-%m-%d %H:%M:%S'))).timestamp())
    cur = 0
    sum = 0
    count = 0
    for j in range(1,len(rows)):
        cur = int(datetime.fromtimestamp(time.mktime(time.strptime(rows[j]['stime'], '%Y-%m-%d %H:%M:%S'))).timestamp())
        sum += (cur - prev)
        count += 1
    if(count!=0):
        data['AJSI'] = str(round(sum/count,2))
    else:
        data['AJSI'] = '0'
    
    #AWT
    sql = "select avg(wtime) as wtime from HPC2010 where queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb' and uid = '" + user[i]['u'] + "';"
    cursor.execute(sql)
    rows = cursor.fetchall()
    data['AWT'] = str(round(float(rows[0]['wtime']),2))

    #AMU
    sql = "select req_mem as mem from HPC2010 where queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb' and uid = '" + user[i]['u'] + "' ;"
    cursor.execute(sql)
    rows = cursor.fetchall()
    sum = 0
    count = 0
    for j in range(len(rows)):
        if(rows[j]['mem'] is not None):
            sum += int(rows[j]['mem'])
            count += 1
    if(count!=0):
        data['AMU'] = str(round(sum/count,2))
    else:
        data['AMU'] = 0

    #MUC
    data['MUC'] = "'"+'2010'+"'"

    #TJS
    sql = "select count(*) as c from HPC2010 where queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb' and uid = '"+ user[i]['u']+"'"
    cursor.execute(sql)
    rows = cursor.fetchall()
    data['TJS'] = str(rows[0]['c'])

    #ANU
    sql = "select req_proc as nodes from HPC2010 where queue not like 'R%' and uid = '"+ user[i]['u'] +"' and queue <> 'workq' and queue <> 'workqsb' "
    cursor.execute(sql)
    rows = cursor.fetchall()
    sum = 0
    count = 0
    for j in range(len(rows)):
        sum += int(rows[j]['nodes'])
        count += 1
    if(count!=0):
        data['ANU'] = str(round(sum/count,2))
    else:
        data['ANU'] = 0

    #CJ
    sql = "select count(*) as c from HPC2010 where queue not like 'R%' and queue <> 'workq' and queue <> 'workqsb' and uid = '"+ user[i]['u']+"' and status='Completed';"
    cursor.execute(sql)
    rows = cursor.fetchall()
    data['CJ'] = str(rows[0]['c'])

    #FJ
    data['FJ'] = str(int(data['TJS']) - int(data['CJ']))

    insertData('user_profile_2010',data)
closeConnection()