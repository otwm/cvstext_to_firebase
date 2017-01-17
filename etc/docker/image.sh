#!/usr/bin/env bash
docker run --name paik-img-server \
           -v /home/rebel9/dev/dockerWork/paik-image:/www/data/resource \
           -v /etc/nginx \
           -p 85:80  \
           --restart=always \
           -d nginx