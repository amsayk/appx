FROM node:6
EXPOSE 5000
ADD . /app
WORKDIR /app

RUN cd /app;  npm install
CMD ["npm", "start"]
