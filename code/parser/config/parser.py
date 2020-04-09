
import re
import random
import json

ibswitch = "^# IB switch no. "
switch_neighbor = "# Switch neighbor  "
switch_name = "SwitchName="
switch_id_guid = {}
switch_guid_id = {}
data = {"nodes":[],"edges":[]}
bool_nodes = []
c = 0
prev = ""
edge_count = {}
n_edges = 0
max_node = ""

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
            bool_nodes.append(values[7])
    else:
        res = re.findall(switch_neighbor,line)
        if(len(res)>0):
            values = line.split()
            print (values)
            if(prev+values[3] in edge_count.keys()):
                edge_count[prev+values[3]] += 1
            else:
                edge_count[prev+values[3]] = 0
            data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":prev,"target":values[3],"size":5,"color":"#013357","type":"curve","count":edge_count[prev+values[3]]})
            n_edges += 1
        else:
            res = re.findall(switch_name,line)
            if(len(res)>0):
                values = line.split()
                values[0] = values[0].split("=")
                values[1] = values[1].split("=")
                values[1][1] = values[1][1].split(",")
                if(len(values)==2 and values[1][0]=='Nodes'):
                    for node in values[1][1]:
                        if(max_node<node):
                            max_node = node
                        if(prev+node in edge_count.keys()):
                            edge_count[prev+node] += 1
                        else:
                            edge_count[prev+node] = 0
                        if(node not in bool_nodes):
                            data["nodes"].append({"id":node,"label":node,"x":random.randint(1,100),"y":random.randint(1,100),"size":10,"color":"#668bfa"})
                            bool_nodes.append(node)
                        data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":prev,"target":node,"size":5,"color":"#2e4180","type":"curve","count":edge_count[prev+node]})
                        n_edges += 1
print (len(data["nodes"]))
with open('data.json', 'w') as fp:
    json.dump(data, fp, indent=4)