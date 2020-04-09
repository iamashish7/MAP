import json

data = {}
QState = {'status':{'R':0,'Q':0,'H':0},'qstate':{}}
with open('jsonoutput.json','r') as fp:
    data = json.load(fp)
    
for k in data.keys():
    if(data[k]['State']=='R'):
        QState['status']['R'] += 1
    elif(data[k]['State']=='Q'):
        QState['status']['Q'] += 1
        if(data[k]['Queue'] not in QState['qstate'].keys()):
            QState['qstate'][data[k]['Queue']] = 1
        else:
            QState['qstate'][data[k]['Queue']] += 1
    elif(data[k]['State']=='H'):
        QState['status']['H'] += 1
    
with open('QState.json','w') as fp:
    json.dump(QState,fp)