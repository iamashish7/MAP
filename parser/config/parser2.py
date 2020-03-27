
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
f = open("hpc2010_topology.conf","r")
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
                edge_count[prev+values[3]] = 0
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
map_nodes = {}
map_nodes['baap'] = 533
level = {}
cnt = 0
for node in data['nodes']:
    map_nodes[node['id']] = cnt
    cnt += 1
n = 0
adj = [ [ 0 for i in range(cnt+1) ] for i in range(cnt+1) ]
for e in leaf_nodes:
    adj[map_nodes[e]][map_nodes['baap']] += 1
    adj[map_nodes['baap']][map_nodes[e]] += 1

for edge in data['edges']:
    adj[map_nodes[edge['source']]][map_nodes[edge['target']]] += 1
    adj[map_nodes[edge['target']]][map_nodes[edge['source']]] += 1

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
t_nodes = {'1':0,'2':0,'3':0}
step = {'1':0,'2':0,'3':0}
degree = {'1':0,'2':0,'3':0}
for node in level:
    t_nodes[str(level[node])] += 1
for key in step:
    step[key] = 360/t_nodes[key]
    
for node in data['nodes']:
    l = level[node['id']]
    node['x'] = (get_radius(str(l))*10) * math.cos(degree[str(l)]) 
    node['y'] = (get_radius(str(l))*10) * math.sin(degree[str(l)])
    degree[str(l)] += step[str(l)]

#with open('data.json', 'w') as fp:
#    json.dump(data, fp, indent=4)