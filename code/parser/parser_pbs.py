"""

This python script is used to filter the logs and insert data to the database. 

Used for inserting logs from single pbs log file duing uploads
"""

import pymysql
import pymysql.cursors
import os
from datetime import datetime
import sys
import random

log_file_name = '/var/www/html/new/code/uploads/'+sys.argv[1]
rand_int = random.randrange(10000, 100000, 1)
database = "tempLogs"
rand_int = random.randrange(10000, 100000, 1)
table_name = "temp"+str(rand_int)
print_str = table_name
headers = []

count = 0
count_neg = 0
id_D = 0
id_R = 0
id_S = 0
id_B = 0
id_C = 0
startY = "99999"
endY = "0"
## Connect to Database
connection = pymysql.connect(host='localhost', user='ashish', passwd='ashish007', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()

DATA = {'Q':{},'S':{}}
exitA_in_run = []
exitD_in_run = []


def createDB():
    #cursor.execute("DROP DATABASE IF EXISTS "+database)
    #cursor.execute("CREATE DATABASE IF NOT EXISTS "+database)
    connection.select_db(database)

def setup():
    createDB()
    table_query = "create table if not exists "+ table_name +" (jobid int(50) NOT NULL AUTO_INCREMENT, jobid_real varchar(50), date varchar(100),stime varchar(100),start varchar(100),end varchar(100),wtime int(50) DEFAULT -1,rtime int(50) DEFAULT -1,proc_alloc int(50) DEFAULT -1,avg_cpu_time int(50) DEFAULT -1,mem_used int(50) DEFAULT -1,req_proc int(50) DEFAULT -1,req_rtime int(50) DEFAULT -1,req_mem int(50) DEFAULT -1,status varchar(50),uid varchar(50) DEFAULT 'NoUser',gid varchar(50) DEFAULT 'NoGroup',exe_app_num int(50) DEFAULT -1,queue varchar(100),part int(50) DEFAULT -1,prec_job_num int(50) DEFAULT -1,think_time int(50) DEFAULT -1,PRIMARY KEY (jobid));"
    cursor.execute(table_query)
    
def insertData(table):
    columns = table.keys()
    values = table.values()
    sql = "INSERT INTO "+table_name+"({0}) VALUES ({1})".format(','.join(columns),','.join(values))
    cursor.execute(sql)

def closeConnection():
    connection.commit()
    cursor.close()
    connection.close()

def toSeconds(time):
    time = time.split(':')
    return int(time[0])*3600 + int(time[1])*60 + int(time[0])

def getEPOCH(timestamp):
    return str(int(datetime.fromtimestamp(time.mktime(time.strptime(timestamp, '%m/%d/%Y %H:%M:%S'))).timestamp()))

def getDate(timestamp):
    temp = timestamp.split()
    d = temp[0].split("/")
    return "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"

def getFormedDate(timestamp):
    temp = timestamp.split()
    d = temp[0].split("/")
    date = d[2]+"-"+d[0]+"-"+d[1]
    date += " "+temp[1]
    return "'"+date+"'"

#reader functions for each status
def record_A(row):
    if(row[2] in exitA_in_run):
        return
    if(row[2] in DATA['S'].keys()):
        exitA_in_run.append(row[2])
        del DATA['S'][row[2]]
    elif(row[2] in DATA['Q'].keys()):
        table = {}
        table['jobid_real'] = "'"+str(row[2])+"'"                  #jobid
        table["`"+'date'+"`"] = getDate(str(DATA['Q'][row[2]]['date']))
        table['stime'] = getFormedDate(str(DATA['Q'][row[2]]['date']))         #submit time
        table['status'] = "'Failed'"
        table['queue'] = "'"+str(DATA['Q'][row[2]]['queue'])+"'"
        del DATA['Q'][row[2]]
        insertData(table)
    else:
        pass
        #print("A record",row[2],"not in running or queued")
        

def record_D(row):
    if(row[2] in exitD_in_run):
        return
    if(row[2] in DATA['S'].keys()):
        exitD_in_run.append(row[2])
        del DATA['S'][row[2]]
    elif(row[2] in DATA['Q'].keys()):
        table = {}
        table['jobid_real'] = "'"+str(row[2])+"'"                  #jobid
        table["`"+'date'+"`"] = getDate(str(DATA['Q'][row[2]]['date']))
        table['stime'] = getFormedDate(str(DATA['Q'][row[2]]['date']))  #submit time
        table['status'] = "'cancelled'"
        table['queue'] = "'"+str(DATA['Q'][row[2]]['queue'])+"'"
        del DATA['Q'][row[2]]
        insertData(table)
    else:
        pass
        #print("D record",row[2],"not in running or queued")
        
def record_Q(row):
    #print (row)
    if(row[2] in DATA['Q'].keys()):
        DATA['Q'][row[2]]['date'] = row[0]
        DATA['Q'][row[2]]['queue'] = row[3].split('=')[1]
    else:
        DATA['Q'][row[2]] = {}
        DATA['Q'][row[2]]['date'] = row[0]
        DATA['Q'][row[2]]['jobid'] = row[2]
        DATA['Q'][row[2]]['queue'] = row[3].split('=')[1]

def record_S(row):
    #print (row)
    if(row[2] in DATA['S'].keys()):
        return
    if(row[2] in DATA['Q'].keys()):
        table = {}
        table['jobid_real'] = row[2]                     #jobid
        table['stime'] = DATA['Q'][row[2]]['date']  #submit time
        table['start'] = '`5`'
        table['end'] = '-1'
        table['wtime'] = ''
        table['rtime'] = ''
        table['proc_alloc'] = ''
        table['avg_cpu_time'] = ''
        table['mem_used'] = ''
        table['req_proc'] = ''
        table['req_rtime'] = ''
        table['req_mem'] = ''
        DATA['S'][row[2]] = table
        del DATA['Q'][row[2]]
    else:
        pass
        #print ("S record",row[2],"not Queued")


def record_E(row):
    #print (row)
    temp = row[3].split()
    d = {}
    for r in temp:
        ele = r.split('=', 1)
        if(len(ele)<2):
            continue
        d[ele[0]] = ele[1]
    if(row[2] in exitA_in_run):
        exitA_in_run.remove(row[2])
        table = {}
        table['jobid_real'] = "'"+str(row[2])+"'"                                    #jobid
        table["`"+'date'+"`"] = "'"+(str(datetime.utcfromtimestamp(int(d['ctime'])))).split()[0]+"'"
        table['stime'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['ctime'])))  #submit time
        table['start'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['start']))) 
        table['end'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['end'])))
        table['wtime'] = str(int(d['start']) - int(d['ctime']))
        table['rtime'] = str(int(d['end']) - int(d['start']))
        table['proc_alloc'] = str(d['resources_used.ncpus'])
        table['avg_cpu_time'] = str((int(d['end']) - int(d['start']))/int(d['resources_used.ncpus']))
        table['mem_used'] = str(d['resources_used.mem'][:-2])
        table['req_proc'] = str(d['Resource_List.ncpus'])
        table['req_rtime'] = str(toSeconds(d['Resource_List.walltime'])) if ('Resource_List.walltime' in d.keys()) else '-1'
        table['status'] = "'Failed'"
        table['uid'] = "'"+str(d['user'])+"'"
        table['gid'] = "'"+str(d['group'])+"'"        
        table['queue'] = "'"+str(d['queue'])+"'"
        insertData(table)
    elif(row[2] in exitD_in_run):
        exitD_in_run.remove(row[2])
        table = {}
        table['jobid_real'] = "'"+str(row[2])+"'"                     #jobid
        table["`"+'date'+"`"] = "'"+(str(datetime.utcfromtimestamp(int(d['ctime'])))).split()[0]+"'"
        table['stime'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['ctime'])))  #submit time
        table['start'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['start']))) 
        table['end'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['end'])))
        table['wtime'] = str(int(d['start']) - int(d['ctime']))
        table['rtime'] = str(int(d['end']) - int(d['start']))
        table['proc_alloc'] = str(d['resources_used.ncpus']) if( 'resources_used.ncpus' in d.keys()) else '-1'
        table['avg_cpu_time'] = str((int(d['end']) - int(d['start']))/int(table['proc_alloc']))
        table['mem_used'] = str(d['resources_used.mem'][:-2]) if ('resources_used.mem' in d.keys()) else '-1'
        table['req_proc'] = str(d['Resource_List.ncpus'])
        table['req_rtime'] = str(toSeconds(d['Resource_List.walltime'])) if ('Resource_List.walltime' in d.keys()) else '-1'
        table['status'] = "'cancelled'"
        table['uid'] = "'"+str(d['user'])+"'"
        table['gid'] = "'"+str(d['group'])+"'"        
        table['queue'] = "'"+str(d['queue'])+"'"
        insertData(table)
    elif(row[2] in DATA['S'].keys()):
        del DATA['S'][row[2]]
        table = {}
        table['jobid_real'] = "'"+str(row[2])+"'"                     #jobid
        table["`"+'date'+"`"] = "'"+(str(datetime.utcfromtimestamp(int(d['ctime'])))).split()[0]+"'"
        table['stime'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['ctime'])))  #submit time
        table['start'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['start']))) 
        table['end'] = "'{0}'".format(datetime.utcfromtimestamp(int(d['end'])))
        table['wtime'] = str(int(d['start']) - int(d['ctime']))
        table['rtime'] = str(int(d['end']) - int(d['start']))
        table['proc_alloc'] = str(d['resources_used.ncpus']) if ('resources_used.ncpus' in d.keys()) else '-1'
        table['avg_cpu_time'] = str((int(d['end']) - int(d['start']))/int(table['proc_alloc'])) if (int(table['proc_alloc']) != 0) else '-1'
        table['mem_used'] = str(d['resources_used.mem'][:-2]) if ('resources_used.mem' in d.keys()) else '-1'
        table['req_proc'] = str(d['Resource_List.ncpus'])
        table['req_rtime'] = str(toSeconds(d['Resource_List.walltime'])) if ('Resource_List.walltime' in d.keys()) else '-1'
        table['status'] = "'Completed'"
        table['uid'] = "'"+str(d['user'])+"'"
        table['gid'] = "'"+str(d['group'])+"'"        
        table['queue'] = "'"+str(d['queue'])+"'"
        insertData(table)
    else:
        pass
        #print("error",row[2])

columns = []

# Function to filter the logs and insert data into the database
def readLog(log_filename):
    global startY,endY
    log_file = open(log_filename, 'r')
    lines = log_file.read().splitlines()
    for line in lines:
        row = line.split(';')
        if(len(row)<2):
            continue
        startY = min(startY,row[0].split()[0].split('/')[2])
        endY = max(endY,row[0].split()[0].split('/')[2])
        
        if row[1]=='A':
            #print ("A")
            record_A(row)
        elif row[1]=='D':
            #print ("D")
            record_D(row)
        elif row[1]=='E':
            #print ("E")
            record_E(row)
        elif row[1]=='Q':
            #print ("Q")
            record_Q(row)
        elif row[1]=='S':
            #print ("S")
            record_S(row)
    log_file.close()


#setting up Database
setup()
# Calling readlog for all the data
readLog(log_file_name)
closeConnection()
print_str += ('#'+startY)
print_str += ('#'+endY)
print_str += ('#0')
print (print_str)
