'''
Parser for SWF log format which inserts data into specific table in SavedLogs database
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| jobid        | int(50)      | NO   | PRI | NULL    |       |
| date         | varchar(100) | YES  |     | NULL    |       |
| stime        | varchar(100) | YES  |     | NULL    |       |
| start        | varchar(100) | YES  |     | NULL    |       |
| end          | varchar(100) | YES  |     | NULL    |       |
| wtime        | int(50)      | YES  |     | NULL    |       |
| rtime        | int(50)      | YES  |     | NULL    |       |
| proc_alloc   | int(50)      | YES  |     | NULL    |       |
| avg_cpu_time | int(50)      | YES  |     | NULL    |       |
| mem_used     | int(50)      | YES  |     | NULL    |       |
| req_proc     | int(50)      | YES  |     | NULL    |       |
| req_rtime    | int(50)      | YES  |     | NULL    |       |
| req_mem      | int(50)      | YES  |     | NULL    |       |
| status       | varchar(50)  | YES  |     | NULL    |       |
| uid          | int(50)      | YES  |     | NULL    |       |
| gid          | int(50)      | YES  |     | NULL    |       |
| exe_app_num  | int(50)      | YES  |     | NULL    |       |
| queue        | varchar(100) | YES  |     | NULL    |       |
| part         | int(50)      | YES  |     | NULL    |       |
| prec_job_num | int(50)      | YES  |     | NULL    |       |
| think_time   | int(50)      | YES  |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
'''

import pymysql
import pymysql.cursors
import sys
import random
import re
import datetime
from email.utils import parsedate_tz
import sys

start_date = "^;[ ]*StartTime:"
end_date = "^;[ ]*EndTime:"
queue_entry = "^;[ ]*Queue:"
n_queues = ";[ ]*MaxQueues:"
# rand_int = random.randrange(10000, 100000, 1)
database = "SavedLogs"
datepattern = re.compile(r'(\w{3} \w{3}) (\d+) (\d+:\d+:\d+) (\w+) (\d{4})')
max_queues = re.compile(r';[ ]*MaxQueues: (\d+)')
table = sys.argv[2]
print_str = database + "#" +table
connection = pymysql.connect(host='localhost', user='monalys', passwd='monalys', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()

def closeConnection():
    connection.commit()
    cursor.close()
    connection.close()

def createDB():
    connection.select_db(database)

def setup():
    createDB();
    table_query = "create table if not exists "+ table +" (jobid int(50),date varchar(100),stime varchar(100),start varchar(100),end varchar(100),wtime int(50),rtime int(50),proc_alloc int(50),avg_cpu_time int(50),mem_used int(50),req_proc int(50),req_rtime int(50),req_mem int(50),status varchar(50),uid int(50),gid int(50),exe_app_num int(50),queue varchar(100),part int(50),prec_job_num int(50),think_time int(50),PRIMARY KEY (jobid));"
    cursor.execute(table_query)
    
def insertData(record):
    columns = record.keys()
    values = record.values()
    sql = "INSERT INTO "+ table +"({0}) VALUES ({1})".format(','.join(columns),','.join(values))
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
f = open(sys.argv[1], "r")
lines = f.readlines()
for line in lines:
    res = re.findall(start_date,line)
    if(len(res)>0):
        matcher = datepattern.search(line)
        date = matcher.group(2)
        if(len(date)==1):
           date = '0'+date
        timestamp = str(matcher.group(1))+' '+date+' '+str(matcher.group(3))+' '+str(matcher.group(4))+' '+str(matcher.group(5))
        timezone = matcher.group(4)
        year = matcher.group(5)
        print_str += '#'+year
        start_time = datetime.datetime.strptime(timestamp, '%a %b %d %H:%M:%S '+timezone+' %Y')
        break

for line in lines:
    res = re.findall(end_date,line)
    if(len(res)>0):
        matcher = datepattern.search(line)
        date = matcher.group(2)
        if(len(date)==1):
           date = '0'+date
        timestamp = str(matcher.group(1))+' '+date+' '+str(matcher.group(3))+' '+str(matcher.group(4))+' '+str(matcher.group(5))
        timezone = matcher.group(4)
        year = matcher.group(5)
        print_str += '#'+year
        start_time = datetime.datetime.strptime(timestamp, '%a %b %d %H:%M:%S '+timezone+' %Y')
        break
    
n_Q = 0
for line in lines:
    res = re.findall(n_queues,line)
    if(len(res)>0):
        matcher = max_queues.search(line)
        n_Q = int(matcher.group(1))
        print_str += '#'+str(n_Q)
        break

c=0
map_Q = {-1:'NoQueue'}
for line in lines:
    res = re.findall(queue_entry,line)
    if(len(res)>0):
        r = line.split()
        #print_str += ';'+r[3].strip()
        if(len(r)<4 or (len(r[3].strip())==1 and n_Q==1)):
            map_Q[int(r[2])] = "Master"
        else:
            map_Q[int(r[2])] = r[3].strip()
        c+=1
    if(c==n_Q):
        break

for line in lines:
    if(line[0]!=';'):
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
#print (print_str, end ="")
#print (map_Q)
