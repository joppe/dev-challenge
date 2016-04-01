SHELL := /bin/bash

pwd := $(shell pwd)

npm:
	npm install

babel:
	node_modules/babel/bin/babel.js $(pwd)/src/ --stage 1 --out-dir $(pwd)/js --modules system

babel-watch:
	node_modules/babel/bin/babel.js $(pwd)/src/ --stage 1 --out-dir $(pwd)/js --modules system --watch

setup: npm babel

clean:
	rm -rf node_modules
