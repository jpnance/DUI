#!/bin/sh


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

dir=chrome/
key=chrome/chrome.pem
name=dui
crx="$name.crx"
pub="$name.pub"
sig="$name.sig"
zip="$name.zip"
trap 'rm -f "$pub" "$sig" "$zip"' EXIT

# zip up the crx dir
cwd=$(pwd -P)
(cd "$dir" && zip -qr -9 -X "$cwd/$zip" .)

# signature
openssl sha1 -sha1 -binary -sign "$key" < "$zip" > "$sig"

# public key
openssl rsa -pubout -outform DER < "$key" > "$pub" 2>/dev/null

byte_swap () {
  # Take "abcdefgh" and return it as "ghefcdab"
  echo "${1:6:2}${1:4:2}${1:2:2}${1:0:2}"
}

crmagic_hex="4372 3234" # Cr24
version_hex="0200 0000" # 2
pub_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$pub" | awk '{print $5}')))
sig_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$sig" | awk '{print $5}')))
(
  echo "$crmagic_hex $version_hex $pub_len_hex $sig_len_hex" | xxd -r -p
  cat "$pub" "$sig" "$zip"
) > "$dir/$crx"
# START CHROME EXTENSION BUILD
