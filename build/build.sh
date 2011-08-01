#!/bin/sh

if [ ! -d chrome ]
then
	mkdir chrome
fi

cp ../chrome/manifest.json chrome/
cp ../chrome/background.html chrome/
cat > chrome/dui.js << EOF
`cat ../common/jquery-1.6.2.min.js`

`cat ../chrome/dui.js`

`cat ../common/dui.js`

EOF