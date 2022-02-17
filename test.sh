#!/bin/bash
counter=1
for ((1 ;100 ;1 ))
do
   echo "Running tests $counter"
npm run test
let counter++
done
