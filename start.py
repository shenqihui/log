#! /usr/bin/python
# encoding=utf-8

import os

def run_debug():
	"""debug"""
	print 'system is running at debug mode...'
	os.system('python manage.py runserver 0.0.0.0:8888')


if __name__ == '__main__':
	run_debug()
