from django.shortcuts import render_to_response, render


def data(request):
    return render_to_response('homepage_data.html')
def echars1(request):
    return render_to_response('homepage_echars1.html')

def echars2(request):
    return render_to_response('homepage_echars2.html')