# MONALYS

MONALYS is a web based application for monitoring and analyzing HPC systems. It has broadly 3 features :-
1.  Job Monitoring : This feature allows you to monitor the job currently in queued, running and hold state including visualization of node allocations using topology visualization. 
2.  Job Analysis : Analyzing jobs for different parameters is possible through this feature. Using this feature user can analyze past data as well as provide his/her custom logs for the analysis. Analysis is done by providing different effective visualization.
3.  Job Predictions : This feature predicts the wait-time for the job user is yet to submit. wait-time prediction helps in planning and better scheduling decisions.

NOTE: This project is currently for HPC systems of IIT Kanpur
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

There are a couple of prerequisites that need to be installed before we start using this tool.

1. Apache2 (skip if already installed)
```
$ sudo apt update
$ sudo apt install apache2
```
2. MySQL (skip if already installed)
```
$ sudo apt install mysql-server
```

3. PHP (skip if already installed)
```
$ sudo apt install php libapache2-mod-php php-mysql
```
4. Now we will install some python libraries
```
$ pip install pymysql
```

### Installing

Before proceding further please make sure you have passwordless ssh for HPC2010 and HPC2013

1. Go to project directory using cd command
2. Run setup.sh
```
$ sudo ./setup.sh
```
 
## Running MONALYS

Your system is now a MONALYS server and your IP can be used by hosts on same network to view MONALYS.

