#!/bin/sh

# Unpack libraries to given directory.

JQUERYUI=jquery-ui-1.12.1.custom
JQUERYUIDIR=jquery-ui/sunny/
JQUI=$JQUERYUIDIR$JQUERYUI

if [ -z "$1" ]
then
    dir=../src
else
    dir=$1
fi

cd "$(dirname "$0")"

cp jquery/jquery-3.3.1.min.js $dir
unzip -qo -j -DD $JQUI.zip $JQUERYUI/images/* -d$dir/images
unzip -qo -j -DD $JQUI.zip $JQUERYUI/jquery-ui.min.css -d$dir
unzip -qo -j -DD $JQUI.zip $JQUERYUI/jquery-ui.min.js -d$dir
cp konva/2.0.3/konva.min.js $dir
