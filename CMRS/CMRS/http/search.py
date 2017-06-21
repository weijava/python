from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from numpy.distutils.fcompiler import none
from CMRS.database.mysqltest import mysql
from CMRS.database.mysqltest import nummysql
from django.http import JsonResponse


def search_form(request):
    return render_to_response('search_form.html')

def data_search(request):
    request.encoding = 'utf-8'
    q = str(request.GET['name'])
    sql1 = 'SELECT name,peifang,laiyuan,yongfa,fangjie,shiyongqk,reference FROM fangji WHERE name="%s"' % q
    sql2 = 'SELECT name,symptom FROM zhongyaodui WHERE symptom like "%' + q + '%"'

    result, num = mysql(sql1)

    context = {'a': result[0].get('name'), 'b': "简介", 'c': "方剂知识源",
                       'd': result[0].get('laiyuan') + result[0].get('peifang') + result[0].get('yongfa'),
               'e': "http://images2015.cnblogs.com/blog/807735/201703/807735-20170320120842924-1769797853.jpg", 'g': "使用情况",
                       'h1': result[0].get('shiyongqk'),'h2': "参考文献",'h3': result[0].get('reference')}

    return render_to_response('homepage_data_search.html', context)


def search(request):
    request.encoding='utf-8'
    q=str(request.GET['question'])
    t=str(request.GET['type'])
    sql1 = 'SELECT name,zyfb,xingwei,guijing,ycjd,hxcf,yfyl,prescription,\
    image FROM cm_dict WHERE name="%s"' % q
    sql2 = 'SELECT name,symptom FROM zhongyaodui WHERE symptom like "%'+q+'%"'

    if t=="ch_medicine":
        result,num=mysql(sql1)

        if num==1:
            #result=mysql(sql1)
            context = {'a': result[0].get('name'), 'b': "简介", 'c': "中药简介",
                       'd': result[0].get('ycjd') + result[0].get('zyfb')+ result[0].get('xingwei') \
                            + result[0].get('guijing')+ result[0].get('yfyl') \
                            + result[0].get('hxcf')
                , 'e': result[0].get('image'), 'g': "相关处方",
                       'h1': result[0].get('prescription'), 'i':q}

        else:
            context = {'a': "未找到", 'b': "相关结果",\
                       'e': "http://images2015.cnblogs.com/blog/807735/201704/807735-20170405173037394-1605434539.jpg", \
                       'h1': "对不起，数据库中未包含此关键词！"}

    elif t=="symptom":
      result,num = mysql(sql2)
      if num==1:
          #result = mysql(sql2)

          context = {'a': "中药对", 'b': "推荐", 'c': "最佳匹配",
                     'd': "【中药对】:" + result[0].get('name') + "【用量】：" + result[0].get('symptom'), 'i': q, \
                     'e': "http://images2015.cnblogs.com/blog/807735/201703/807735-20170320120842924-1769797853.jpg", \
                     'g': "更多结果", 'h1': "无更多结果！",'j': "selected"}

      elif num==0:
          context = {'a': "未找到", 'b': "相关结果", \
                     'e': "http://images2015.cnblogs.com/blog/807735/201704/807735-20170405173037394-1605434539.jpg", \
                     'h1': "对不起，数据库中未包含此关键词！"}

      else :
          #result = mysql(sql2)
          h=[" "," "," "," "]
          for i in range(1,num):
              h[i]="【中药对】:"+result[i].get('name')+"【简介】："+ result[i].get('symptom')

          context = {'a': "中药对", 'b': "推荐", 'c': "最佳匹配",
                'd': "【中药对】:"+result[0].get('name')+"【简介】："+ result[0].get('symptom'),'i':q,\
                'e':"http://images2015.cnblogs.com/blog/807735/201703/807735-20170320120842924-1769797853.jpg",\
                'g':"更多结果",'h1':h[1] ,'h2':h[2],'h3':h[3], 'j': "selected"}

    return render_to_response('homepage_bottom.html',context)
