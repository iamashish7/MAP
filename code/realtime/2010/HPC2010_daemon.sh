while(true)
do
ssh ${1}@hpc2010.hpc.iitk.ac.in 'qstat -a -n' > file
./readnew
python calcQState.py
sleep 60
done
