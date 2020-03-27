#include<stdio.h>
#include<iostream>
#include<string>
#include<string.h>
#include<sstream>
#include<stdlib.h>
#include<fstream>
using namespace std;
void appnd(string token,string& str,int i);
int main()
{
    ifstream fs("file");
    ofstream fw;
    fw.open("jsonoutput.json");
    string line;
    string token;
    int i,flag;
    bool flag_un, flag_eof;

    for(int i=0; i<5; i++)
        getline(fs,line);
    fw << "{";
    int linesread=0;
    getline(fs,line);
    do
    {
       stringstream linestream(line);
        i=0;
        string ln;
        if(linesread!=0)
            fw << ",";
        while(linestream >> token)
        {

            if(i==4 || i==7)
            {
               i++;
               continue;
            }


            appnd(token,ln,i);
             i++;
        }

        linesread++;
//cout << line <<endl;
        flag_eof = true;
        string t,p;
        while(getline(fs,line))
        {

            if(strstr(line.c_str(),"un")==NULL)
            {
                p=line;
                int slash_index = p.find('/');
                while(slash_index!=-1)
                {
                    t+="\"" + p.substr(slash_index-5, 5)+"\""+ ",";
                    //appnd(t,ln,11);
                    p=p.substr(slash_index+1,-1);
                    slash_index = p.find('/');
                }
            }
            else
            {
                flag_un=true;
                flag_eof=false;
                break;
            }
        }
        t=t.substr(0,t.size()-1);
        appnd(t,ln,11);
        fw << ln;

    }while(!flag_eof);
    fw << "}";
    return 0;
}
void appnd(string token,string& str, int a)
{
    string temp;
    int flag;
    if(a==0)
        temp = "\""+token+"\""+": {";
    if(a==1)
        temp =string(" \"Username\" :") + "\""+ token +string("\"");
    if(a==2)
        temp = string(", \"Queue\" :")+"\""+token+string("\"");
    if(a==3)
        temp =string(", \"Jobname\" :")+"\""+token+string("\"");
    if(a==5)
        temp = string(", \"Nodes\" :")+"\""+token+string("\"");
    if(a==6)
        temp = (((", \"Task\" :"+string("\""))+token)+"\"");
    if(a==8)
        temp = (((", \"RequiredTime\" :"+string("\""))+token)+"\"");
    if(a==9)
        temp = (((", \"State\" :"+string("\""))+token)+"\""+"\n");
    if(a==10)
        temp = (((", \"Elapsed_Time\" :"+string("\""))+token)+"\"");
    if(a==11)
        temp = (((", \"Exec_host\" :" +string("[")+ token) +"]""}\n"));
    str.append(temp);
        //return flag;
}
