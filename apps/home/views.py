#coding:utf-8

from django.shortcuts import render
from django.http import HttpResponse



def index(request):
  return render(request, 'index.html')

def datadue(request):
  data = 'dd'
  data = request.GET.get('data', '')
  print data
  return HttpResponse('''
        done();
    ''' % data)
