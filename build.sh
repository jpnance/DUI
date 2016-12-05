#!/bin/bash

if [ -d build ]
then
	rm -rf build
fi

mkdir build

cp manifest.json build/
cp jquery-1.6.2.min.js build/
cp background.js build/
cp dui.js build/

cd build

zip dui.zip manifest.json jquery-1.6.2.min.js background.js dui.js
