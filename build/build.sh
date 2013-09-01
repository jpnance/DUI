#!/bin/bash


# START COMMON BUILD
if [ -d common ]
then
	rm -rf common
fi

mkdir common

for file in ../common/*
do
	sed -f ../common/dictionary.sed ${file} > common/$(basename ${file})
done
# END COMMON BUILD


# START GREASEMONKEY BUILD
if [ -d gm ]
then
	rm -rf gm
fi

mkdir gm

for file in ../gm/*
do
	sed -f ../common/dictionary.sed ${file} > gm/$(basename ${file})
done

cat > gm/dui.user.js << EOF
`cat gm/dui-gm.js`

`cat common/dui-common.js`
EOF
# END GREASEMONKEY BUILD


# START CHROME EXTENSION BUILD
if [ -d chrome ]
then
	rm -rf chrome
fi

mkdir chrome

for file in ../chrome/*
do
	sed -f ../common/dictionary.sed ${file} > chrome/$(basename ${file})
done

cat > chrome/dui.js << EOF
`cat common/jquery-1.6.2.min.js`

`cat chrome/dui-chrome.js`

`cat common/dui-common.js`
EOF

zip chrome/dui.zip chrome/manifest.json chrome/dui.js chrome/background.js
