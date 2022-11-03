FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY dashboard/dist /usr/share/nginx/html/dashboard
COPY simple-tsx/dist /usr/share/nginx/html/simple-tsx
COPY simple-jsx/dist /usr/share/nginx/html/simple-jsx
COPY nginx.conf /etc/nginx/conf.d/default.conf
