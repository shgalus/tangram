# Makefile: description file for make

SHELL = /bin/sh

LIBS = jquery-3.3.1.min.js jquery-ui.min.js jquery-ui.min.css images	\
	konva.min.js
SOURCE = tangram.utils.js tangram.geometry.js tangram.shapes.js	\
	 tangram.settings.js tangram.ui.js tangram.main.js

.PHONY: all libs lint rel clean spotless

all: lint

libs:
	../extern/unpack.sh

lint:
	eslint $(SOURCE)
	jshint $(SOURCE)

rel:
	./release.sh

clean:
spotless: clean
	rm -rf ../bin
	rm -rf $(LIBS)
