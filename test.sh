#!/bin/bash
counter=1
for ((;;))
do
echo "Running tests $counter"
npm run test
let counter++
done
