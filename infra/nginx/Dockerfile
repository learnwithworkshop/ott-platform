# Nginx Dockerfile
FROM nginx:1.25-alpine

# Install openssl for certificate generation
RUN apk add --no-cache openssl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates (should be mounted or generated)
# In development, we'll generate self-signed certificates
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem -days 365 -nodes \
    -subj "/C=IN/ST=State/L=City/O=OTT/CN=localhost"

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
