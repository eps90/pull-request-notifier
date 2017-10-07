#!/usr/bin/env bash
node_modules/.bin/remap-istanbul -i build/coverage/json/coverage-final.json -o build/coverage/lcov.info -t lcovonly
node_modules/.bin/codacy-coverage < build/coverage/lcov.info
echo $?
