docker run -d -v /photos --name data ubuntu:14.10
docker run -d -p 27017:27017 --name database dockerfile/mongodb
# docker run -it --rm -v $PWD:/data --name nodeapp dockerfile/nodejs node app/server.js
docker run -d -v $PWD:/data --volumes-from data --link database:database --name nodeapp dockerfile/nodejs node app/server.js
docker run --volumes-from data --link nodeapp:localnode -d -p 80:80 -v $PWD/sites-available/:/etc/nginx/sites-enabled dockerfile/nginx
