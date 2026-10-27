#!/bin/bash

# Overwrite the default Nginx configuration
cp /home/site/wwwroot/azure/default.conf /etc/nginx/sites-available/default
service nginx reload

# Unlock Laravel storage and cache directories (CRITICAL FIX)
cd /home/site/wwwroot
chmod -R 777 storage bootstrap/cache

# Optimize Laravel and run migrations
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
