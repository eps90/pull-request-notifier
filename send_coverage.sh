#!/usr/bin/env bash
node_modules/.bin/remap-istanbul -i build/coverage/json/coverage-final.json -o build/coverage/lcov.info -t lcovonly
cat build/coverage/lcov.info | node_modules/.bin/codacy-coverage
