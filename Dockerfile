FROM      node:12.13-alpine
WORKDIR   /app
COPY      package.json ./
RUN       yarn
COPY      . .
EXPOSE    3000
CMD       ["yarn", "start:dev"]
