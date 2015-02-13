# coding: utf-8

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns(
    'apps.home.views',

    url(r'^$', 'index', name='index'),
    url(r'^data$', 'datadue', name='datadue'),
)
