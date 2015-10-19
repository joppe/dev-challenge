SHELL := /bin/bash

pwd := $(shell pwd)

bower:
	bower install

npm:
	npm install

symlinks:
	cd web/vendor && ln -s ../../node_modules/es6-module-loader
	cd web/vendor && ln -s ../../node_modules/systemjs

babel:
	node_modules/babel/bin/babel.js $(pwd)/src/ --stage 1 --out-dir $(pwd)/web/js --modules system

babel-watch:
	node_modules/babel/bin/babel.js $(pwd)/src/ --stage 1 --out-dir $(pwd)/web/js --modules system --watch

setup: npm bower symlinks babel


