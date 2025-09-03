# social-map

```
git clone https://github.com/Feodal0p/social-map.git
```

# social-map-laravel

```
cd social-map/social-map-laravel/
```
```
cp .env.example .env
```
In .env setup DB

```
composer install
```
```
docker-compose up -d
```
```
php artisan key:generate
```
```
php artisan migrate
```
```
php artisan serve
```
# social-map-react

```
cd social-map/social-map-react/
```
```
npm install
```
```
cp .env.example .env.local
```
In .env.local setup VITE_BACKEND_URL

```
npm run dev
```