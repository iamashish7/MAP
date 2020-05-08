import re
import time
import random
import math
import json

def find_parent(node,adj_list,level_nodes,l):
    for n in level_nodes[l+1]:
        if(node in adj_list[n]):
            return n

map_switch_id_guid = {}
map_switch_guid_id = {}
data = {'nodes':[], 'edges':[]}
adj_list = {'Sentinal':[]}
level = {}
added_nodes = []
n_edges = 0
switch_definition = re.compile(r'# IB switch no. (\d*): (ibsw\d*) GUID: (0x\w{16})')
links_nodes = re.compile(r'SwitchName=(ibsw\d*) Nodes=([\w,]*)')
links_switch = re.compile(r'SwitchName=(ibsw\d*) Switches=([\w,]*)')

f = open("hpc2013topo.conf.new","r")
lines = f.read().splitlines()
for line in lines:
    mo = switch_definition.search(line) 
    if mo!=None:
        if(mo.group(2)!='ibsw142'):
            map_switch_id_guid[mo.group(2)] = mo.group(3)
            map_switch_guid_id[mo.group(3)] = mo.group(2)
            if(mo.group(3) not in added_nodes):
                data["nodes"].append({"id":mo.group(3),"label":mo.group(2),"x":random.randint(1,100),"y":random.randint(1,100),"size":10,"color":"#0c5d78"})
                added_nodes.append(mo.group(3))

for line in lines:
    mo = links_nodes.search(line) 
    if mo!=None:
        if(mo.group(1)!='ibsw142'):
            adj_list[map_switch_id_guid[mo.group(1)]] = []
            nodes = mo.group(2).split(',')
            for node in nodes:
                if(node[0]=='h' and node[1]=='p' and node[2]=='c'):
                    adj_list[node] = ['Sentinal']
                    adj_list['Sentinal'].append(node)
                    adj_list[map_switch_id_guid[mo.group(1)]].append(node)
                    adj_list[node].append(map_switch_id_guid[mo.group(1)])
                    if(node not in added_nodes):
                        data["nodes"].append({"id":node,"label":node,"x":random.randint(1,100),"y":random.randint(1,100),"size":3,"color":"#668bfa"})
                        added_nodes.append(node)
                    data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":map_switch_id_guid[mo.group(1)],"target":node,"size":1,"color":"#8fa4eb","type":"line"})
                    n_edges += 1

for line in lines:
    mo = links_switch.search(line)
    if mo!=None:
        if(map_switch_id_guid[mo.group(1)] not in adj_list.keys()):
            adj_list[map_switch_id_guid[mo.group(1)]] = []
        switches = mo.group(2).split(',')
        for switch in switches:
            if(switch!='ibsw142'):
                if(map_switch_id_guid[switch] not in adj_list.keys()):
                    adj_list[map_switch_id_guid[switch]] = []
                adj_list[map_switch_id_guid[mo.group(1)]].append(map_switch_id_guid[switch])
                adj_list[map_switch_id_guid[switch]].append(map_switch_id_guid[mo.group(1)])
                # data["edges"].append({"id":'e'+str(n_edges),"label":"Edge"+str(n_edges),"source":map_switch_id_guid[mo.group(1)],"target":map_switch_id_guid[switch],"size":1,"color":"#8fa4eb","type":"line"})
                n_edges += 1
   
level['Sentinal'] = 0
Q = ['Sentinal']
while(len(Q)>0):
    u = Q[0]
    Q = Q[1:]
    for v in adj_list[u]:
        if(v not in level.keys()):
            level[v] = level[u]+1
            Q.append(v)
del level['Sentinal']
del adj_list['Sentinal']
min_level,max_level = min(level.values()),max(level.values())
level_nodes = {}
for l in range(min_level,max_level+1):
    level_nodes[l] = []
for key in level:
    level_nodes[level[key]].append(key)

for key in level_nodes:
    level_nodes[key].sort()

printing_order = {}
t_nodes = {}
step = {}
degree = {}
for l in range(min_level,max_level+1):
    printing_order[l] = []
    t_nodes[l] = 0
    step[l] = 0
    degree[l] = 0

for node in level:
    t_nodes[level[node]] += 1

for key in step:
    step[key] = 360/t_nodes[key]

done = []
for n5 in level_nodes[5]:
    for n4 in adj_list[n5]:
        if(level[n4]==4):
            for n3 in adj_list[n4]:
                if(level[n3]==3):
                    for n2 in adj_list[n3]:
                        if(level[n2]==2):
                            for n1 in adj_list[n2]:
                                if(level[n1]==1):
                                    for nodee in data['nodes']:
                                        if(nodee['id'] not in done and nodee['id']==n1):
                                            l = 1
                                            done.append(nodee['id'])
                                            nodee['x'] = 30 * math.cos(degree[l]*(math.pi/180)) 
                                            nodee['y'] = 33 * math.sin(degree[l]*(math.pi/180))
                                            degree[l] += step[l]
                            for nodee in data['nodes']:
                                if(nodee['id'] not in done and nodee['id']==n2):
                                    l = 2
                                    done.append(nodee['id'])
                                    nodee['x'] = 23 * math.cos(degree[l]*(math.pi/180)) 
                                    nodee['y'] = 26 * math.sin(degree[l]*(math.pi/180))
                                    degree[l] += step[l]
                    for nodee in data['nodes']:
                        if(nodee['id'] not in done and nodee['id']==n3):
                            l = 3
                            done.append(nodee['id'])
                            nodee['x'] = 16 * math.cos(degree[l]*(math.pi/180)) 
                            nodee['y'] = 19 * math.sin(degree[l]*(math.pi/180))
                            degree[l] += step[l]
            for nodee in data['nodes']:
                if(nodee['id'] not in done and nodee['id']==n4):
                    l = 4
                    done.append(nodee['id'])
                    nodee['x'] = 9 * math.cos(degree[l]*(math.pi/180)) 
                    nodee['y'] = 12 * math.sin(degree[l]*(math.pi/180))
                    degree[l] += step[l]
    for nodee in data['nodes']:
        if(nodee['id'] not in done and nodee['id']==n5):
            l = 5
            done.append(nodee['id'])
            nodee['x'] = 2 * math.cos(degree[l]*(math.pi/180)) 
            nodee['y'] = 5 * math.sin(degree[l]*(math.pi/180))
            degree[l] += step[l]
        
                                    
# for l in range(max_level-1,min_level-1,-1):
#     print (l)
#     for node in printing_order[l+1]:
#         for n in adj_list[node]:
#             if n not in printing_order[l] and level[n]==l:
#                 printing_order[l].append(n)
#     print (len(printing_order[l]))
    
    # printing_order[l] = level_nodes[l]
    # curr_parent = find_parent(printing_order[l-1][0],adj_list,level_nodes,l-1)
    # printing_order[l].append(curr_parent)
    # for node in printing_order[l-1]:
    #     if(find_parent(node,adj_list,level_nodes,l-1) != curr_parent):
    #         curr_parent = find_parent(node,adj_list,level_nodes,l-1)
    #         if curr_parent not in printing_order[l]:
    #             printing_order[l].append(curr_parent)

# x_r = 6
# y_r = 10

# for l in range(max_level,min_level-1,-1):
#     for n in printing_order[l]:
#         for node in data['nodes']:
#             if(node['id']==n):
#                 node['x'] = x_r * math.cos(degree[l]*(math.pi/180)) 
#                 node['y'] = y_r * math.sin(degree[l]*(math.pi/180))
#                 degree[l] += step[l]
#     x_r += 10
#     y_r += 10

with open('data.json', 'w') as fp:
    json.dump(data, fp, indent=4)


