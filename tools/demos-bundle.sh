#!/bin/bash

rm -f examples/*-bundle.js;

find examples \
  -iname '*.ts' \
  ! -iname '*.d.ts' \
  -exec sh -c 'browserify --extension .ts {} -o examples/$(basename {} .ts)-bundle.js' \;