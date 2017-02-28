#!/bin/bash

find . -name "*.js" -type f -not -path "./node_modules/*" -not -path "./scripts/*" -not -path "./rollup.config.js" -delete
find . -name "*.js.map" -type f -not -path "./node_modules/*" -delete
find . -name "*.d.ts" -type f -not -path "./node_modules/*" -delete
find . -name "*.metadata.json" -type f -not -path "./node_modules/*" -delete
find . -name "*.css" -type f -not -path "./node_modules/*" -not -path "./scripts/*" -delete
rm -rf aot/ dist/
