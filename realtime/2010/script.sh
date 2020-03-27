while(true)
do
#ssh ashishpl@hpc2010.hpc.iitk.ac.in 'qstat -a -n' > file
sshpass -p 'ashish"65640' ssh ashishpl@hpc2010.hpc.iitk.ac.in 'qstat -a -n' > file
#ssh -X ashishpl@hpc2010.hpc.iitk.ac.in 'qstat -a -n' > file
./readnew
python calcQState.py
sleep 60
done
