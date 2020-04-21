'''
Parser for cori topology file
'''
import math
import functools
import json

def compare(e1,e2):
    e1 = int(e1[1:])
    e2 = int(e2[1:])
    return e1-e2

data = {"nodes":[],"edges":[]}
switches = []
parent = {}
f = open("coritopology.conf","r")
lines = f.read().splitlines()
adj_list = {}
for line in lines:
    if(line.split()[0].split('=')[0]=='SwitchName'):
        switch_name = line.split()[0].split('=')[1]
    adj_list[switch_name] = []
    if(line.split()[1].split('=')[0]=='Switches'):
        for e in line.split()[1].split('=')[1][2:-1].split(','):
            e = e.split('-')
            for i in range(int(e[0]),int(e[1])+1):
                 adj_list[switch_name].append('s'+str(i))
                 parent['s'+str(i)] = switch_name
                 switches.append('s'+str(i))
    else:
        for e in line.split()[1].split('=')[1][4:-1].split(','):
            e = e.split('-')
            for i in range(int(e[0]),int(e[1])+1):
                 adj_list[switch_name].append(i)
                 parent[i] = switch_name

a=50
b=50
n_edges=0
root_switches = list(set(adj_list.keys())-set(switches))
root_switches = sorted(root_switches,key=functools.cmp_to_key(compare))
step = 360/len(root_switches)
degree = 0
#plotting root switches
for e in root_switches:
    x = a * math.cos(degree*(math.pi/180)) 
    y = b * math.sin(degree*(math.pi/180))
    data["nodes"].append({"id":e,"label":e,"x":x,"y":y,"size":500,"color":"#0c5d78"})
    degree += step
queue = root_switches
plotted_switches = len(root_switches)
while(plotted_switches<len(adj_list.keys())):
    a += 100
    b += 100
    step = 0
    degree = 0
    next_level_nodes = []
    for e in queue:
        next_level_nodes += adj_list[e]
    next_level_nodes = list(set(next_level_nodes))
    step = 360/len(next_level_nodes)
    next_level_nodes = sorted(next_level_nodes,key=functools.cmp_to_key(compare))
    for e in next_level_nodes:
        x = a * math.cos(degree*(math.pi/180)) 
        y = b * math.sin(degree*(math.pi/180))
        data["nodes"].append({"id":e,"label":e,"x":x,"y":y,"size":len(adj_list[e]),"color":"#0c5d78"})
        data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":parent[e],"target":e,"size":5,"color":"#2e4180","type":"line","count":1})
        degree += step
        n_edges += 1
    plotted_switches += len(next_level_nodes)
    queue = next_level_nodes

leaves = []
for e in next_level_nodes:
    leaves += adj_list[e]
a += 100
b += 100
step = 360/len(leaves)
degree = 0
#plotting leaf nodes
for e in leaves:
    x = a * math.cos(degree*(math.pi/180)) 
    y = b * math.sin(degree*(math.pi/180))
    data["nodes"].append({"id":e,"label":e,"x":x,"y":y,"size":10,"color":"#668bfa"})
    data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":parent[e],"target":e,"size":5,"color":"#2e4180","type":"line","count":1})
    degree += step
    n_edges += 1

with open('data.json', 'w') as fp:
    json.dump(data, fp, indent=4)
