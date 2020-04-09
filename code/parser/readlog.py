"""

This python script is used to filter the log and insert data to the database. 
NOTE : Uncomment the insertData statements in the readLog function to insert the data into the database.

Authors : Arun KP and Upasana Singh

"""

import pymysql
import pymysql.cursors
import os
from datetime import datetime

log_formatfile = "log_format.txt"
headers = []

dictt = {}
table1 = {}
table2 = {}
table3 = {}
Resource_list = {}
Resource_used = {}
cpu_used = {}

## Connect to Database
connection = pymysql.connect(host='localhost', user='ashish', passwd='ashish007',db='HPC5', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()


def createDB():
	cursor.execute("DROP DATABASE IF EXISTS "+database)
	cursor.execute("CREATE DATABASE IF NOT EXISTS "+database)
	connection.select_db(database)

def insertData(table_name,table):
	columns = table.keys()
	#print (columns)
	values = table.values()
	#print (values)
	sql = "INSERT INTO {0}({1}) VALUES ({2})".format(table_name,','.join(columns),','.join(values))
	cursor.execute(sql)

def closeConnection():
	connection.commit()
	cursor.close()
	connection.close()

def flatten(input):
	new_list = []
	for i in input:
		if isinstance(i,list):
			for j in i:
				new_list.append(j)
		else:
			new_list.append(i)
	return new_list

columns = []

# Function to filter the logs and insert data into the database
def readLog(log_filename):
	#print (log_filename)
	fail = []
	fd1 = open('sql1.txt', 'w+')
	fd2 = open('sql2.txt', 'w+')
	fd3 = open('sql3.txt', 'w+')
	fd4 = open('sql4.txt', 'w+')
	fd5 = open('sql5.txt', 'w+')
	log_file = open(log_filename, 'r')
	lines = log_file.read().splitlines()
	for line in lines:
		table1 = {}
		table2 = {}
		table3 = {}
		cpu_used = {}
		#print (line);
		row = line.split(';')
		if row[2] != 'license':
			table1["`"+'jobid'+"`"] = "'"+row[2]+"'"
			temp = row[0].split()
			d = temp[0].split("/")
			table1["`"+'date'+"`"] = "'"+d[2]+"-"+d[0]+"-"+d[1]+"'"
			table1["`"+'time'+"`"] = "'"+temp[1]+"'"
			table1["`"+'status'+"`"] = "'"+row[1]+"'"
			temp = row[3].split()
			new_row = []
			for res in temp:
				if 'exec_host' in res:
					pass
				elif 'exec_vnode' in res:
					pass
				elif 'Resource_List' in res:
					pass
				elif 'resources_used' in res:
					pass
				elif 'resource_assigned' in res:
					pass
				elif 'requestor' in res:
					pass
				else:
					new_row.append(res)


			fd1.write(str(table1) + '\n')
			fd2.write(str(temp) + '\n')
						
			for i in new_row:
				ele = i.split('=', 1)
				if(ele[0].lower()=='exit_status'):
					table1["`"+'exitstatus'+"`"] = "'"+ele[1]+"'"
				elif(ele[0]=='run_count'):
					table1["`"+'runcount'+"`"] = "'"+ele[1]+"'"
				elif(ele[0]=='ctime'):
					table1["`"+'ctime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
				elif(ele[0] == 'qtime'):
					table1["`"+'qtime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
				elif(ele[0] == 'etime'):
					table1["`"+'etime'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
				elif(ele[0] == 'start'):
					table1["`"+'start'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))
				elif(ele[0] == 'end'):
					table1["`"+'end'+"`"] = "'{0}'".format(datetime.utcfromtimestamp(int(ele[1])))	
				elif len(ele) == 1:
					table1["`"+'message'+"`"] = "'{0}'".format(ele[0])
				else:
					table1["`"+ele[0]+"`"] = "'"+ele[1]+"'"
			#if('end=' in line and 'start=' in line):
			#	if(table1["`"+'start'+"`"] > table1["`"+'end'+"`"]):
			#		print (table1["`"+'start'+"`"],table1["`"+'end'+"`"])
			#		fail.append(lines.index(line)+1)
					
			#print (table1)
			insertData('loganalysis_master',table1)

			temp1 = [res.replace('Resource_List.','',1) for res in temp if 'Resource_List' in res]
			temp2 = []
			for i in temp1:
				if 'cput' in i:
					temp2.append(i)
				elif 'walltime' in i:
					temp2.append(i)
				elif ':' in i:
					pass
				else:
					temp2.append(i)

			table2["`"+'jobid'+"`"] = "'"+row[2]+"'"
			for i in temp2:
				ele = i.split('=')
				if('interactive_tasks' in ele[0]):
					table2["`"+'InteractiveTasks'+"`"] = "'"+ele[1]+"'"
				else:
					table2["`"+ele[0]+"`"] = "'"+ele[1]+"'"


			fd3.write(str(table2) + '\n')

			if(row[1]=='S'):
				insertData('loganalysis_resourcelist',table2)

			temp1 = [res.replace('resources_used.','') for res in temp if 'resources_used' in res]
			table3["`"+'jobid'+"`"] = "'"+row[2]+"'"
			for i in temp1:
				ele = i.split('=')
				if(ele[0]=='mem'):
					table3["`"+ele[0]+"`"] = "'"+ele[1].replace('kb','')+"'"
				elif(ele[0]=='vmem'):
					table3["`"+ele[0]+"`"] = "'"+ele[1].replace('kb','')+"'"
				else:
					table3["`"+ele[0]+"`"] = "'"+ele[1]+"'"
			if(row[1]=='E'):
				insertData('loganalysis_resourceused',table3)
			
			fd4.write(str(table3) + '\n')

			## Added for new table cpu_used
			for i in new_row:
				ele = i.split('=', 1)
				if(ele[0] == 'start'):
					new_var = '{0}'.format(datetime.utcfromtimestamp(int(ele[1])))
				else:
					pass		
			
			if row[1] == 'S':
				temp = row[3].split()
				for res in temp:
					if 'exec_host' in res:
						temp_row = res.split('=')[1]
						if 'pc' in temp_row:
							print (temp_row)
						t1 = []
						t1 = temp_row.split('+')
						t2 = []
						for i in t1:
							t2.append(i.replace('cn',''))
						t3 = []
						t3 = [j.split('/')[0].lstrip('0') for j in t2]
						for k in t3:
							cpu_used["`"+'jobid'+"`"] = "'"+row[2]+"'"
							cpu_used["`"+'cpus'+"`"] = "'"+k+"'"	
							cpu_used["`"+'start'+"`"] = "'"+new_var+"'"
							#print(k)
							#print(new_var)
						insertData('loganalysis_cpuused',cpu_used)	
					else:
						pass
	#if(len(fail)!=0):
	#	dictt[log_filename] = fail
	log_file.close()
	fd1.close()
	fd2.close()
	fd3.close()
	fd4.close()
	fd5.close()

# Calling readlog for all the data
for (root,dirs,files) in os.walk('hlogs/', topdown=True):
	#print (files)
	for name in files:
		print(os.path.join(root, name))
		log_filename = os.path.join(root, name)
		readLog(log_filename)
	#print (dictt)

closeConnection()
