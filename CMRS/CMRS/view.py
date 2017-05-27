from django.http import HttpResponse
from django.shortcuts import render
from CMRS.database.mysqltest import mysql
from django.http import  HttpResponseRedirect

# print(CMRS.database.mysqltest.name1)

def hello(request):
    sql1 = 'SELECT * FROM homepage'
    result,num = mysql(sql1)
    context = {'a': result[0].get('a') ,'b': result[0].get('b'),'c': result[0].get('c'),'d': result[0].get('d')\
               ,'e': result[0].get('e'),'f': result[0].get('f'),'g': result[0].get('g'),'h1': result[0].get('h')}
    return render(request, 'homepage.html', context)

def myview(request):
    return HttpResponseRedirect("http://blog.csdn.net/lvze0321/article/details/53302189")