from django.http import HttpResponse
from django.shortcuts import render_to_response
from numpy.distutils.fcompiler import none
from CMRS.database.mysqltest import mysql


def search_form(request):
    return render_to_response('search_form.html')

def search(request):
    request.encoding='utf-8'
    q=str(request.GET['question'])
    sql1 = 'SELECT * FROM ch_medicine WHERE name="%s"' % q
    result=str(mysql(sql1))
    if q:
        message='中药简介：'+result
    else:
        message='你提交了空表单'
    return HttpResponse(message)
