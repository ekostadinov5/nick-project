FROM node:alpine as build
WORKDIR /app
COPY nick-project-frontend/package.json .
COPY nick-project-frontend/package-lock.json .
RUN npm ci --silent
RUN npm install react-scripts -g --silent
COPY nick-project-frontend .
ARG REACT_APP_BACKEND_ENDPOINT
ENV REACT_APP_BACKEND_ENDPOINT $REACT_APP_BACKEND_ENDPOINT
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nick-project-frontend/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]