FROM node:6
EXPOSE 5000
ADD . /app
WORKDIR /app

RUN cd /app;
CMD ["npm", "run", "run"]
