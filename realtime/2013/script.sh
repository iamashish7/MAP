while(true)
do
#ssh ashishpl@hpc2013.hpc.iitk.ac.in 'qstat -a -n' > file
sshpass -p 'ashish"65640' ssh ashishpl@hpc2013.hpc.iitk.ac.in 'qstat -a -n' > file
./readnew
sleep 60
done
