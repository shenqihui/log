#! /usr/bin/python
# encoding=utf-8

import os

def run_debug():
  """debug"""
  print 'system is running at debug mode...'
  os.system('python manage.py makemigrations')
  os.system('python manage.py migrate')


if __name__ == '__main__':
  run_debug()
