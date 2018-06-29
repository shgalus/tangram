#!/bin/sh

# Put all distribution files in bin directory.

if [ ! -z "`git status --untracked-files=no --porcelain`" ]; then
    echo 'Warning: uncommitted changes exist'
fi

bindir=../bin
version=`git describe --tags --long --abbrev=40`
fname=tangram_`git describe --tags --long | grep -o '.......$'`
build_date=`date +"%d.%m.%Y, %H.%M.%S"`
copyright="/*
 * Tangram
 * Copyright (c) 2018 Stanisław Galus
 * Licensed under the MIT License
 * Version: $version
 * Build date: $build_date
 */"

rm -rf $bindir
mkdir $bindir

{ echo "$copyright" & \
sed -e "s/version = \"[^\"]*\"/version = \"$version\"/" \
    -e "s/buildDate = \"[^\"]*\"/buildDate = \"$build_date\"/" \
    tangram.main.js | \
    cat tangram.utils.js tangram.geometry.js tangram.shapes.js \
        tangram.settings.js tangram.ui.js - ;} > $bindir/$fname.js

{ echo "$copyright" & uglifyjs $bindir/$fname.js -c -m; } \
    > $bindir/$fname.min.js

sed -e "/^<script src=\"tangram/d" \
    -e "/^<script src=\"konva/a <script src=\"$fname.min.js\"><\/script>" \
    tangram.html > $bindir/tangram.html

cp tangram.css $bindir
cp report.php $bindir

../extern/unpack.sh $bindir

cat <<EOF > $bindir/.htaccess
DirectoryIndex tangram.html
EOF
