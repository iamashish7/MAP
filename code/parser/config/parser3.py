import re
import random
import json
import math

def get_radius(l):
    if(l=='3'):
        return 1
    if(l=='2'):
        return 2
    if(l=='1'):
        return 3

def transpose(mat, tr, N): 
    for i in range(N): 
        for j in range(N): 
            tr[i][j] = mat[j][i] 

def isSymmetric(mat, N): 
    tr = [ [0 for j in range(len(mat[0])) ] for i in range(len(mat)) ] 
    transpose(mat, tr, N) 
    for i in range(N): 
        for j in range(N): 
            if (mat[i][j] != tr[i][j]): 
                return False
    return True
    
ibswitch = "^# IB switch no. "
switch_neighbor = "# Switch neighbor  "
switch_name = "SwitchName="
total_links = "# Total number of links in this switch =  "
switch_id_guid = {}
switch_guid_id = {}
data = {"nodes":[],"edges":[]}
bool_nodes = []
c = 0
prev = ""
edge_count = {}
n_edges = 0
max_node = ""
leaf_nodes = []
f = open("hpc2010_topology_2.conf","r")
lines = f.read().splitlines()
for line in lines:
    res = re.findall(ibswitch,line)
    if(len(res)>0):
        values = line.split(" ",maxsplit=9)
        switch_id_guid[values[5]] = values[7]
        switch_guid_id[values[7]] = values[5]
        prev = values[7]
        if(values[7] not in bool_nodes):
            data["nodes"].append({"id":values[7],"label":values[5],"x":random.randint(1,100),"y":random.randint(1,100),"size":10,"color":"#0c5d78"})
            #data["nodes"].append({"id":values[7],"label":values[5],"x":10 * math.cos(math.pi * 2 * len(data['nodes']) / 533 ),"y":10 * math.sin(math.pi * 2 * len(data['nodes']) / 533 ),"size":10,"color":"#0c5d78"})
            bool_nodes.append(values[7])
    else:
        res = re.findall(switch_neighbor,line)
        if(len(res)>0):
            values = line.split()
            if(values[3]=="CA"):
                continue
            if(prev+values[3] in edge_count.keys()):
                edge_count[prev+values[3]] += 1
            else:
                edge_count[prev+values[3]] = 1
            data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":prev,"target":values[3],"size":5,"color":"#013357","type":"curve","count":edge_count[prev+values[3]]})
            n_edges += 1
        else:
            res = re.findall(total_links,line)
            if(len(res)>0):
                values = line.split()
                data["nodes"][-1]["size"] = int(values[9])
            else:        
                res = re.findall(switch_name,line)
                if(len(res)>0):
                    values = line.split()
                    values[0] = values[0].split("=")
                    values[1] = values[1].split("=")
                    values[1][1] = values[1][1].split(",")
                    if(len(values)==2 and values[1][0]=='Nodes'):
                        for node in values[1][1]:
                            leaf_nodes.append(node)
                            if(max_node<node):
                                max_node = node
                            if(prev+node in edge_count.keys()):
                                edge_count[prev+node] += 1
                            else:
                                edge_count[prev+node] = 0
                            if(node not in bool_nodes):
                                data["nodes"].append({"id":node,"label":node,"x":random.randint(1,100),"y":random.randint(1,100),"size":10,"color":"#668bfa"})
                                bool_nodes.append(node)
                            data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":prev,"target":node,"size":5,"color":"#2e4180","type":"line","count":edge_count[prev+node]})
                            n_edges += 1


leaf_nodes = list(set(leaf_nodes))
map_nodes = {'baap':534}
map_nodes_inv = {534:'baap'}
level = {}
cnt = 0
for node in data['nodes']:
    map_nodes[node['id']] = cnt
    map_nodes_inv[cnt] = node['id']
    cnt += 1
n = 0
adj = [ [ 0 for i in range(cnt+1) ] for j in range(cnt+1) ]
for e in leaf_nodes:
    adj[map_nodes[e]][map_nodes['baap']] += 1
    adj[map_nodes['baap']][map_nodes[e]] += 1

for edge in data['edges']:
    adj[map_nodes[edge['source']]][map_nodes[edge['target']]] += 1
    adj[map_nodes[edge['target']]][map_nodes[edge['source']]] += 1


#print ('[')
#for l in adj[:-1]:
#    print (l[:-1],end=',\n')
#print ('];')
   
level['baap'] = 0
Q = ['baap']
temp =  {0:0,1:0,2:0}
while(len(Q)>0):
    u = Q[0]
    Q = Q[1:]
    for v in map_nodes.keys():
        if(adj[map_nodes[u]][map_nodes[v]] and v not in level.keys()):
            level[v] = level[u]+1
            Q.append(v)
del level['baap']

print (min(level.values()),max(level.values()))


#print ("var level = { ",end='')
#for key in level.keys():
#    print ('"'+key+'":',end='')
#    print (level[key],end=', ')
#print ("};",end='')
adj_list = [{},{},{}]
 
for i in range(len(adj)-1):
    adj_list[level[map_nodes_inv[i]]-1][map_nodes_inv[i]] = []
    for j in range(len(adj[i])-1):
        if(i!=j and adj[i][j]):
            adj_list[level[map_nodes_inv[i]]-1][map_nodes_inv[i]].append(map_nodes_inv[j])

'''
print ("var adj_list = [ ",end='')
print ("{ ",end='')
for key in adj_list[0].keys():
    print ('"'+key+'": [',end='')
    for j in range(len(adj_list[0][key])):
        print ('"'+adj_list[0][key][j]+'"',end=', ')
    print ("a],",end='')
print ("}, ",end='')
print ("{ ",end='')
for key in adj_list[1].keys():
    print ('"'+key+'": [',end='')
    for j in range(len(adj_list[1][key])):
        print ('"'+adj_list[1][key][j]+'"',end=', ')
    print ("a],",end='')
print ("}, ",end='')
print ("{ ",end='')
for key in adj_list[2].keys():
    print ('"'+key+'": [',end='')
    for j in range(len(adj_list[2][key])):
        print ('"'+adj_list[2][key][j]+'"',end=', ')
    print ("a],",end='')
print ("} ",end='')
print ("];")
'''
  
t_nodes = {'1':0,'2':0,'3':0}
step = {'1':0,'2':0,'3':0}
degree = {'1':0,'2':0,'3':0}
for node in level:
    t_nodes[str(level[node])] += 1

for key in step:
    step[key] = 360/t_nodes[key]

for node in adj_list[1].keys():
    #print ("key = ",node)
    for n in adj_list[1][node]:
        if(level[n]==1):
            #print ("    child = ",n)
            for nodee in data['nodes']:
                if(nodee['id']==n):
                    #print ("        modifying node = ",nodee['id'],level[n])
                    l = 1
                    nodee['x'] = 25 * math.cos(degree[str(l)]*(math.pi/180)) 
                    nodee['y'] = 30 * math.sin(degree[str(l)]*(math.pi/180))
                    degree[str(l)] += step[str(l)]
    for nodee in data['nodes']:
        if(nodee['id']==node):
            #print ("modifying node = ",nodee['id'],level[node])
            l = 2
            nodee['x'] = 16.6 * math.cos(degree[str(l)]*(math.pi/180)) 
            nodee['y'] = 20 * math.sin(degree[str(l)]*(math.pi/180))
            degree[str(l)] += step[str(l)]

#print (degree)

for node in data['nodes']:
    l = level[node['id']]
    if(l==3):
        #print (l)
        node['x'] = 8.3 * math.cos(degree[str(l)]*(math.pi/180)) 
        node['y'] = 10 * math.sin(degree[str(l)]*(math.pi/180))
        degree[str(l)] += step[str(l)]

edges = []
#print (len(data['edges']))

for e1 in data['edges']:
    for e2 in data['edges']:
        if(e1['source']==e2['target'] and e1['target']==e2['source']):
            data['edges'].remove(e1)
            break

for e1 in data['edges']:
    if(level[e1['source']]!=1 and level[e1['target']]!=1):
        data['edges'].remove(e1)
ce = 0
for e1 in data['edges']:
    if(level[e1['source']]!=1 and level[e1['target']]!=1):
        ce += 1
#print (ce,len(data['edges']))

#with open('data.json', 'w') as fp:
#    json.dump(data, fp, indent=4)
#print (level['0x00066a00e3002acc'])
level3 = adj_list[2]
set_nodes = set(level3['0x00066a00e3002a83'])   
for key in level3.keys():
    set_nodes = set_nodes | set(level3[key])
#print (len(set_nodes))
set2 = set(adj_list[1].keys())
#print (len(set2))
s = set2 - set_nodes
#print (s)
'''
with open('data.json', 'w') as fp:
    json.dump(data, fp, indent=4)
'''