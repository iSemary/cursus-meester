# Convert SCSS to CSS
gnome-terminal -- bash -c "sass --watch resources/js/public/assets/css/style.scss:resources/js/public/assets/css/style.css"

# Install backend dependencies
composer install

# run the laravel app
gnome-terminal -- bash -c "php artisan serve"

# Change directory to resources/js
cd resources/js

# Install frontend dependencies
npm install

# Run the application locally
npx next dev
