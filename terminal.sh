#!/bin/bash

#gnome-terminal 
#--tab --title="Test instance 1" --command="npm run test; $SHELL'" 
#--tab --title="Test instance 2" --command="npm run test; $SHELL'" 
#--tab --title="Test instance 3" --command="npm run test; $SHELL'"





myfunc() {
    for ((i=0 ; i < 10 ; i++)); do
        echo "Running tests $counter"
        npm run test
    done
}


for ((i=0 ; i < $1 ; i++)); do
  gnome-terminal --tab --title="tab $i" -- bash -c while true; do {echo $(npm run test) done} $SHELL}
done