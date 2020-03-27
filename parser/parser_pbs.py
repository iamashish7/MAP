"""

This python script is used to filter the log and insert data to the database. 

"""

import pymysql
import pymysql.cursors
import os
from datetime import datetime
import sys
import random

log_file_name = '/var/www/html/new/uploads/'+sys.argv[1]
rand_int = random.randrange(10000, 100000, 1)
database = "temp"+str(rand_int)
print_str = database
#print (database,end="")
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


def createDB():
    cursor.execute("DROP DATABASE IF EXISTS "+database)
    cursor.execute("CREATE DATABASE IF NOT EXISTS "+database)
    connection.select_db(database)

def setup():
    createDB()
    table = "create table if not exists id_table (id int(50),jobid varchar(50) not null,KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_A (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,message varchar(120),PRIMARY KEY (id),KEY (jobid));"
    cursor.execute(table)
    table = "create table if not exists Master_B (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,end varchar(50),ctime varchar(50),name varchar(100),`resource_list.seqnode_binding` varchar(50),`resource_list.ncpus` varchar(50),duration varchar(50),`resource_list.place` varchar(50),`resource_list.walltime` varchar(50),`resource_list.select` varchar(50),queue varchar(50),start varchar(120),`resource_list.nodect` varchar(50),owner varchar(50),nodes varchar(100),authorized_users varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_C (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,message varchar(50),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_D (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,message varchar(150),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_E (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,resvname varchar(120),exit_status varchar(120),`resource_list.ncpus` varchar(120),`resource_list.place` varchar(120),`resource_list.walltime` varchar(120),`resource_list.select` varchar(120),`resource_list.software` varchar(120),`session` varchar(120),`resource_list.matlab_user` varchar(120),`resource_list.fluent` varchar(120),project varchar(120),`resource_list.mpiprocs` varchar(120),`group` varchar(120),`resource_list.lms_limit` varchar(120),resvid varchar(120),`resource_list.fluent_lic` varchar(120),etime varchar(120),`resources_used.cput` varchar(120),start varchar(120),`resource_list.nodect` varchar(120),`resource_list.min_walltime` varchar(120),exec_host varchar(4000),exec_vnode varchar(4000),qtime varchar(120),array_indices varchar(120),`resources_used.mem` varchar(120),jobname varchar(120),`resource_list.interactive_tasks` varchar(120),user varchar(120),end varchar(120),`resources_used.vmem` varchar(120),`resource_list.max_walltime` varchar(120),`resources_used.walltime` varchar(120),ctime varchar(120),`resource_list.seqnode_binding` varchar(120),`resource_list.mem` varchar(120),`resources_used.ncpus` varchar(120),`resource_list.matlab_lic` varchar(120),`resources_used.cpupercent` varchar(120),`queue` varchar(120),`resource_list.nodes` varchar(120),`run_count` varchar(120),`resource_list.fluent_user` varchar(120),`resource_list.cput` varchar(120),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_K (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,requestor varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_k (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,requestor varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_L (status varchar(5) not null,spec_license varchar(100),keyword varchar(100),hour varchar(50),max varchar(50),month varchar(50),time varchar(50),date varchar(50),day varchar(50))"
    cursor.execute(table)
    table = "create table if not exists Master_M (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,destination varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_Q (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,queue varchar(20),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_R (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,`resvname` varchar(120),`exit_status` varchar(120),`resource_list.ncpus` varchar(120),`resource_list.place` varchar(120),`resource_list.walltime` varchar(120),`resource_list.select` varchar(120),`session` varchar(120),`resource_list.matlab_user` varchar(120),`project` varchar(120),`resource_list.mpiprocs` varchar(120),`group` varchar(120),`resource_list.lms_limit` varchar(120),`resvid` varchar(120),`resource_list.fluent_lic` varchar(120),`etime` varchar(120),`resources_used.cput` varchar(120),`start` varchar(120),`resource_list.nodect` varchar(120),`resource_list.min_walltime` varchar(120),`exec_host` varchar(4000),`exec_vnode` varchar(4000),`qtime` varchar(120),`resources_used.mem` varchar(120),`jobname` varchar(120),`resource_list.interactive_tasks` varchar(120),`user` varchar(120),`end` varchar(120),`resources_used.vmem` varchar(120),`resource_list.max_walltime` varchar(120),`resources_used.walltime` varchar(120),`ctime` varchar(120),`resource_list.seqnode_binding` varchar(120),`resources_used.ncpus` varchar(120),`resource_list.matlab_lic` varchar(120),`resources_used.cpupercent` varchar(120),`queue` varchar(120),`resource_list.nodes` varchar(120),`run_count` varchar(120),`resource_list.fluent_user` varchar(120),`resource_list.cput` varchar(120),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_S (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,resvname varchar(120),`resource_list.ncpus` varchar(120),`resource_list.place` varchar(120),`resource_list.walltime` varchar(120),`resource_list.select` varchar(120),`resource_assigned.ncpus` varchar(120),`resource_list.software` varchar(120),`resource_list.matlab_user` varchar(120),`resource_list.fluent` varchar(120),`resource_assigned.mem` varchar(120),`project` varchar(120),`resource_list.mpiprocs` varchar(120),`group` varchar(120),`resource_list.lms_limit` varchar(120),`resvid` varchar(120),`resource_list.fluent_lic` varchar(120),`etime` varchar(120),`start` varchar(120),`resource_list.nodect` varchar(120),`resource_list.min_walltime` varchar(120),`exec_host` varchar(4000),`exec_vnode` varchar(4000),`qtime` varchar(120),`array_indices` varchar(120),`jobname` varchar(120),`resource_list.interactive_tasks` varchar(120),`user` varchar(120),`resource_list.max_walltime` varchar(120),`ctime` varchar(120),`resource_list.seqnode_binding` varchar(120),`resource_list.mem` varchar(120),`resource_list.matlab_lic` varchar(120),`queue` varchar(120),`resource_list.nodes` varchar(120),`resource_list.fluent_user` varchar(120),`resource_assigned.interactive_tasks` varchar(120),`resource_list.cput` varchar(120),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_T (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,message varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_U (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,requestor varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)
    table = "create table if not exists Master_Y (id int(50),jobid varchar(50) not null,date varchar(15) not null,time varchar(15) not null,status varchar(5) not null,requestor varchar(100),PRIMARY KEY (id),KEY (jobid))"
    cursor.execute(table)

def getID(row):
    global count,count_neg
    cursor.execute("select id from id_table where jobid='{0}'".format(row[2]))
    rows = cursor.fetchall()
    if(row[1]=='E' or row[1]=='K' or row[1]=='k' or row[1]=='p'):
        if(len(rows)!=0):
            idd = rows[0]['id']
            sql = "delete from id_table where jobid='{0}'".format(row[2])
            cursor.execute(sql)
            return str(idd)
        else:
            count_neg = count_neg - 1
            return str(count_neg)

    if(row[1]=='Q' or row[1]=='P' or row[1]=='U'):
        count = count + 1
        sql = "INSERT INTO id_table(id,jobid) VALUES ({0},'{1}')".format(count,row[2])
        cursor.execute(sql)
        return (str(count))
    else:
        if(len(rows)!=0):
            return str(rows[0]['id'])
        else:
            count_neg = count_neg-1
            return str(count_neg)
def insertData(table_name,table):
    columns = table.keys()
    values = table.values()
    sql = "INSERT INTO {0}({1}) VALUES ({2})".format(table_name,','.join(columns),','.join(values))
    cursor.execute(sql)
def closeConnection():
    connection.commit()
    cursor.close()
    connection.close()
    
#reader functions for each status
def record_A(row,idd):
    tableA = {}
    tableA["`"+'id'+"`"] = "'"+idd+"'"
    tableA["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableA["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableA["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableA["`"+'status'+"`"] = "'"+row[1]+"'"
    tableA["`"+'message'+"`"] = "'"+row[3]+"'"
    insertData('Master_A',tableA)
def record_B(row,idd):
    global id_B
    tableB = {}
    tableB["`"+'id'+"`"] = "'"+idd+"'"
    tableB["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableB["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableB["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableB["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        if(ele[0]=='ctime'):
            tableB["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'qtime'):
            tableB["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'etime'):
            tableB["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'start'):
            tableB["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'end'):
            tableB["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        else:
            tableB["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    if int(idd)>int(id_B):
        id_B = idd
        insertData('Master_B',tableB)
def record_C(row,idd):
    global id_C
    tableC = {}
    tableC["`"+'id'+"`"] = "'"+idd+"'"
    tableC["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableC["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableC["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableC["`"+'status'+"`"] = "'"+row[1]+"'"
    tableC["`"+'message'+"`"] = "'"+row[3]+"'"
    if int(idd)>int(id_C):
        id_C = idd
        insertData('Master_C',tableC)
def record_D(row,idd):
    global id_D
    tableD = {}
    tableD["`"+'id'+"`"] = "'"+idd+"'"
    tableD["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableD["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableD["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableD["`"+'status'+"`"] = "'"+row[1]+"'"
    tableD["`"+'message'+"`"] = "'"+row[3]+"'"
    if int(idd)>int(id_D):
        id_D = idd
        insertData('Master_D',tableD)
def record_E(row,idd):
    tableE = {}
    tableE["`"+'id'+"`"] = "'"+idd+"'"
    tableE["`"+'jobid'+"`"] = "'"+row[2]+"'"
    if(idd==str(28)):
        pass
    temp = row[0].split()
    d = temp[0].split("/")
    tableE["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableE["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableE["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        if(ele[0]=='ctime'):
            tableE["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'qtime'):
            tableE["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'etime'):
            tableE["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'start'):
            tableE["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'end'):
            tableE["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        else:
            tableE["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    insertData('Master_E',tableE)
def record_K(row,idd):
    tableK = {}
    tableK["`"+'id'+"`"] = "'"+idd+"'"
    tableK["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableK["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableK["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableK["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tableK["`"+'requestor'+"`"] = "'"+ele[1]+"'"
    insertData('Master_K',tableK)
def record_k(row,idd):
    tablek = {}
    tablek["`"+'id'+"`"] = "'"+idd+"'"
    tablek["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tablek["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tablek["`"+'time'+"`"] = "'"+temp[1]+"'"
    tablek["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tablek["`"+'requestor'+"`"] = "'"+ele[1]+"'"
    insertData('Master_k',tablek)
def record_L(row):
    tableL = {}
    tableL["`"+'keyword'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableL["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableL["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableL["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split(" ",2)
    tableL["`"+'spec_license'+"`"] = "'"+temp[0]+" "+temp[1]+"'"
    temp2 = temp[2].split()
    for r in temp2:
        ele = r.split(':', 1)
        if(ele[0]=='ctime'):
            tableL["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'qtime'):
            tableL["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'etime'):
            tableL["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'start'):
            tableL["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'end'):
            tableL["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        else:
            tableL["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    insertData('Master_L',tableL)
def record_M(row,idd):
    tableM = {}
    tableM["`"+'id'+"`"] = "'"+idd+"'"
    tableM["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableM["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableM["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableM["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tableM["`"+'destination'+"`"] = "'"+ele[1]+"'"
    insertData('Master_M',tableM)
def record_P(row,idd):
    tableP = {}
    tableP["`"+'id'+"`"] = "'"+idd+"'"
    tableP["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableP["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableP["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableP["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        tableP["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    insertData('Master_P',tableP)
def record_p(row,idd):
    tablep = {}
    tablep["`"+'id'+"`"] = "'"+idd+"'"
    tablep["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tablep["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tablep["`"+'time'+"`"] = "'"+temp[1]+"'"
    tablep["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        tablep["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    insertData('Master_p',tablep)
def record_Q(row,idd):
    tableQ = {}
    tableQ["`"+'id'+"`"] = "'"+idd+"'"
    tableQ["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableQ["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableQ["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableQ["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tableQ["`"+'queue'+"`"] = "'"+ele[1]+"'"
    insertData('Master_Q',tableQ)
def record_R(row,idd):
    global id_R
    tableR = {}
    tableR["`"+'id'+"`"] = "'"+idd+"'"
    tableR["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableR["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableR["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableR["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        if(ele[0]=='ctime'):
            tableR["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'qtime'):
            tableR["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'etime'):
            tableR["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'start'):
            tableR["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'end'):
            tableR["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        else:
            tableR["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    if int(idd)>int(id_R):
        id_R = idd
        insertData('Master_R',tableR)
def record_S(row,idd):
    global id_S
    tableS = {}
    tableS["`"+'id'+"`"] = "'"+idd+"'"
    tableS["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableS["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableS["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableS["`"+'status'+"`"] = "'"+row[1]+"'"
    temp = row[3].split()
    for r in temp:
        ele = r.split('=', 1)
        if(ele[0]=='ctime'):
            tableS["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'qtime'):
            tableS["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'etime'):
            tableS["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'start'):
            tableS["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        elif(ele[0] == 'end'):
            tableS["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
        else:
            tableS["`"+ele[0].lower()+"`"] = "'"+ele[1]+"'"
    if int(idd)>int(id_S):
        id_S = idd
        insertData('Master_S',tableS)
def record_T(row,idd):
    tableT = {}
    tableT["`"+'id'+"`"] = "'"+idd+"'"
    tableT["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableT["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableT["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableT["`"+'status'+"`"] = "'"+row[1]+"'"
    tableT["`"+'message'+"`"] = "'"+row[3]+"'"
    insertData('Master_T',tableT)
def record_U(row,idd):
    tableU = {}
    tableU["`"+'id'+"`"] = "'"+idd+"'"
    tableU["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableU["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableU["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableU["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tableU["`"+'requestor'+"`"] = "'"+ele[1]+"'"
    insertData('Master_U',tableU)
def record_Y(row,idd):
    tableY = {}
    tableY["`"+'id'+"`"] = "'"+idd+"'"
    tableY["`"+'jobid'+"`"] = "'"+row[2]+"'"
    temp = row[0].split()
    d = temp[0].split("/")
    tableY["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
    tableY["`"+'time'+"`"] = "'"+temp[1]+"'"
    tableY["`"+'status'+"`"] = "'"+row[1]+"'"
    ele = row[3].split('=', 1)
    tableY["`"+'requestor'+"`"] = "'"+ele[1]+"'"
    insertData('Master_Y',tableY)

columns = []

# Function to filter the logs and insert data into the database
def readLog(log_filename):
    log_file = open(log_filename, 'r')
    lines = log_file.read().splitlines()
    global startY
    global endY
    for line in lines:
        startY = min(startY,line.split()[0].split('/')[2])
        endY = max(endY,line.split()[0].split('/')[2])
        row = line.split(';')
        if row[1]!='L':
            idd = getID(row)
        
        if row[1]=='A':
            record_A(row,idd)
        elif row[1]=='B':
            record_B(row,idd)
        elif row[1]=='C':
            record_C(row,idd)
        elif row[1]=='D':
            record_D(row,idd)
        elif row[1]=='E':
            record_E(row,idd)
        elif row[1]=='K':
            record_K(row,idd)
        elif row[1]=='k':
            record_k(row,idd)
        elif row[1]=='L':
            record_L(row)
        elif row[1]=='M':
            record_M(row,idd)
        elif row[1]=='P':
            record_P(row,idd)
        elif row[1]=='p':
            record_p(row,idd)
        elif row[1]=='Q':
            record_Q(row,idd)
        elif row[1]=='R':
            record_R(row,idd)
        elif row[1]=='S':
            record_S(row,idd)
        elif row[1]=='T':
            record_T(row,idd)
        elif row[1]=='U':
            record_U(row,idd)
        elif row[1]=='Y':
            record_Y(row,idd)
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