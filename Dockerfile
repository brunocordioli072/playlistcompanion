FROM node:10


WORKDIR /explorer

EXPOSE 3000
ENV HOST 0.0.0.0
CMD [ "npm", "run","start:local" ]