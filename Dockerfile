FROM node:alpine as builder
LABEL org.opencontainers.image.authors="Slavik Svyrydiuk <slavik@svyrydiuk.eu>"
EXPOSE 80
ARG ENVIRONMENT="production"

WORKDIR /app

COPY . /app
RUN npm install -g @angular/cli && \
  npm install && \
  ng build --configuration=${ENVIRONMENT}

FROM nginx:alpine
COPY --from=builder \
  /app/dist/moll-frontend/browser/ /usr/share/nginx/html
COPY docker/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/
# FIXME probably these 2 lines are not needed while building
# on github CI/CD
RUN find /usr/share/nginx/html -type d -exec chmod 0755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 0644 {} \;
