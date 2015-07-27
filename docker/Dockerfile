FROM    ubuntu
RUN     apt-get update
RUN     apt-get install -y nodejs
RUN     apt-get install -y npm

EXPOSE  8080
ENTRYPOINT cd bundle && npm install && /usr/bin/nodejs app.js
