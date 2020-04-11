import pymysql
import pymysql.cursors
import sys
import random
import re
import datetime
from email.utils import parsedate_tz

start_date = "^; StartTime:"
end_date = "^; EndTime:"
queue_entry = "^; Queue:"
n_queues = "; MaxQueues:"
rand_int = random.randrange(10000, 100000, 1)
database = "temp"+str(rand_int)
print_str = database
connection = pymysql.connect(host='localhost', user='ashish', passwd='ashish007', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()

def closeConnection():
	connection.commit()
	cursor.close()
	connection.close()

def createDB():
	cursor.execute("DROP DATABASE IF EXISTS "+database)
	cursor.execute("CREATE DATABASE IF NOT EXISTS "+database)
	connection.select_db(database)

def setup():
	createDB()
	table = "create table if not exists Master (jobid int(50),date varchar(100),stime varchar(100),start varchar(100),end varchar(100),wtime int(50),rtime int(50),proc_alloc int(50),avg_cpu_time int(50),mem_used int(50),req_proc int(50),req_rtime int(50),req_mem int(50),status varchar(50),uid int(50),gid int(50),exe_app_num int(50),queue varchar(100),part int(50),prec_job_num int(50),think_time int(50),PRIMARY KEY (jobid));"
	cursor.execute(table)
	
def insertData(table):
    columns = table.keys()
    values = table.values()
    sql = "INSERT INTO Master({0}) VALUES ({1})".format(','.join(columns),','.join(values))
    cursor.execute(sql)

def getStatus(s):
    if(s=='0'):
        return "Failed"
    if(s=='1'):
        return "Completed"
    elif(s=='2'):
        return "partially executed"
    elif(s=='3'):
        return "last exec(1)"
    elif(s=='4'):
        return "last exec(0)"
    elif(s=='5'):
        return "cancelled"
    else:
        return "Failed"
    
start_time = datetime.time()
entry = {}
setup()
f = open('/var/www/html/new/code/uploads/'+sys.argv[1], "r")
lines = f.readlines()
for line in lines:
    res = re.findall(start_date,line)
    if(len(res)>0):
        r = line.split(" ",maxsplit=2)
        r2 = line.split()
        print_str += '#'+r[2].strip().split()[5]
        start_time = datetime.datetime.strptime(r[2], '%a %b %d %H:%M:%S '+r2[6]+' %Y\n')
        break

for line in lines:
    res = re.findall(end_date,line)
    if(len(res)>0):
        r = line.split(" ",maxsplit=2)
        print_str += '#'+r[2].strip().split()[5]
        break

n_Q = 0
for line in lines:
    res = re.findall(n_queues,line)
    if(len(res)>0):
        r = line.split(" ",maxsplit=2)
        print_str += '#'+r[2].strip()
        n_Q = int(r[2])
        break

c=0
map_Q = {}
for line in lines:
    res = re.findall(queue_entry,line)
    if(len(res)>0):
        r = line.split()
        #print_str += ';'+r[3].strip()
        map_Q[int(r[2])] = r[3].strip() 
        c+=1
    if(c==n_Q):
        break

for line in lines:
    entry = {}
    values = line.split()
    if (len(values)==18):
        entry["jobid"] = (values[0])
        entry["date"] = "'"+((start_time + datetime.timedelta(seconds=int(values[1]))).strftime('%Y-%m-%d'))+"'"
        entry["stime"] = "'"+((start_time + datetime.timedelta(seconds=int(values[1]))).strftime('%Y-%m-%d %H:%M:%S'))+"'"
        entry["wtime"] = (values[2])
        entry["rtime"] = (values[3])
        entry["proc_alloc"] = (values[4])
        entry["avg_cpu_time"] = (values[5])
        entry["mem_used"] = (values[6])
        entry["req_proc"] = (values[7])
        entry["req_rtime"] = (values[8])
        entry["req_mem"] = (values[9])
        entry["status"] = "'"+getStatus(values[10])+"'"
        entry["uid"] = (values[11])
        entry["gid"] = (values[12])
        entry["exe_app_num"] = (values[13])
        entry["queue"] = "'"+map_Q[int(values[14])]+"'" if(len(map_Q)>0) else "'"+values[14]+"'"
        entry["part"] = (values[15])
        entry["prec_job_num"] = (values[16])
        entry["think_time"] = (values[17])
        entry["start"] = "'"+((start_time + datetime.timedelta(seconds=int(int(values[1]) + int(values[2])))).strftime('%Y-%m-%d %H:%M:%S'))+"'"
        entry["end"] = "'"+((start_time + datetime.timedelta(seconds=(int(values[1])+int(values[2])+int(values[3])))).strftime('%Y-%m-%d %H:%M:%S'))+"'"
        insertData(entry)
closeConnection()
print (print_str, end ="")