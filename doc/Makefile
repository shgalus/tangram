# Makefile: description file for make

SHELL = /bin/sh

%.pdf : %.tex
	pdflatex $(*F)
	pdflatex $(*F)

.PHONY: all clean spotless

all: tangram.pdf

clean:
	rm -f *.aux *.log
spotless: clean
	rm -f tangram.pdf
