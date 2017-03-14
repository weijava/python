from django.http import HttpResponse
from django.shortcuts import render
import CMRS.database.mysqltest

# print(CMRS.database.mysqltest.name1)

def hello(request):
    context = {'hello': "hello world"}
    return render(request, 'homepage.html', context)
#aaaaaa
