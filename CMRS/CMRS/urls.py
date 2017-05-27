from django.conf.urls import url
from django.contrib import admin

from CMRS.http.echars import echars1, echars2, data
from CMRS.view import hello
from CMRS.http.search import search_form, data_search
from CMRS.http.search import search
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import staticfiles

urlpatterns = [

    url(r'^search-form/$', search_form),
	url(r'^search/$', search),
    url(r'^data/$', data),
    url(r'^data/search/$', data_search),
    url(r'^echars1/$', echars1),
    url(r'^echars2/$', echars2),
    url('', hello),
]
