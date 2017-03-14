from django.conf.urls import url
from django.contrib import admin
from CMRS.view import hello
from CMRS.http.search import search_form
from CMRS.http.search import search

urlpatterns = [
    url(r'^hello/$', hello),
    url(r'^search-form/$', search_form),
	url(r'^search/$', search),
]
