#!/bin/bash
#параметры: "пароль" "2 букв код страны" "область" "город" "компания" "домен"
password=$1
country=$2
state=$3
locality=$4
organization=$5
domain=$6

mkdir -p ../app/certificates/CA
openssl genrsa -des3 -out ../app/certificates/CA/ca.key -passout pass:$password 1024
openssl req -new -key ../app/certificates/CA/ca.key -out ../app/certificates/CA/ca.csr -passin pass:$password -subj "/C=$country/ST=$state/L=$locality/O=$organization/CN=$domain"
openssl x509 -req -days 365 -in ../app/certificates/CA/ca.csr -out ../app/certificates/CA/ca.crt -signkey ../app/certificates/CA/ca.key -passin pass:$password

openssl genrsa -des3 -out ../app/certificates/CA/server.key -passout pass:$password 1024
openssl req -new -key ../app/certificates/CA/server.key -out ../app/certificates/CA/server.csr -passin pass:$password -subj "/C=$country/ST=$state/L=$locality/O=$organization/CN=$domain"
cp ../app/certificates/CA/server.key ../app/certificates/CA/server.key.org
openssl rsa -in ../app/certificates/CA/server.key.org -out ../app/certificates/CA/server.key -passin pass:$password
openssl x509 -req -days 365 -in ../app/certificates/CA/server.csr -out ../app/certificates/CA/server.crt -signkey ../app/certificates/CA/server.key -passin pass:$password
