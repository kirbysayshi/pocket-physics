#!/bin/bash

ENTRYPOINTS=$(
  for f in examples/*.ts; do
    echo $f | grep -q -v '.d.ts' &&
      echo "$f:examples/$(basename $f .ts)-bundle.js ";
  done
)

npx beefy $ENTRYPOINTS -- --extension .ts