while(true)
do
ssh ${1}@hpc2013.hpc.iitk.ac.in 'qstat -a -n' > file
./readnew
sleep 60
done
