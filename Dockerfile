FROM php:8.1

RUN apt update && apt upgrade -y && apt install bash git curl -y

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

RUN php composer-setup.php

RUN php -r "unlink('composer-setup.php');"

RUN mv composer.phar /usr/local/bin/composer

RUN docker-php-ext-install pdo_mysql

WORKDIR /var/www/api

COPY . /var/www/api