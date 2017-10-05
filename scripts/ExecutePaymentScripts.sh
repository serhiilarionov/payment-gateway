#!/bin/bash

for file in $(find ./db -name 'MD*')
 do
  if ! [$(PGPASSWORD=test123 psql -U postgres -h 192.168.1.67 -p 5432 -f $file -d payment) has errors]
    then
      echo error in $file
      exit 1
    fi
done

for file in $(find ./db -name 'DT*')
 do
    if ! [$(PGPASSWORD=test123 psql -U postgres -h 192.168.1.67 -p 5432 -f $file -d payment) has errors]
    then
      echo error in $file
      exit 1
    fi
done