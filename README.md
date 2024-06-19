# Cursus Meester
E-learning platform that brings together passionate instructors and curious learners from all around the world. With an extensive library of high-quality courses, ranging from programming and design to business and personal development.

<p align="center" style="margin:0"><img src="https://skillicons.dev/icons?i=laravel,next,react,nodejs,&perline=4"/></p>
<p align="center">
  <img width="70px" height="70px" src="https://api.iconify.design/devicon:socketio-wordmark.svg" alt="Socket.IO"/>
  &nbsp;&nbsp;&nbsp;
  <img width="70px" height="70px" src="https://api.iconify.design/logos:stripe.svg" alt="Stripe"/>&nbsp;&nbsp;&nbsp;
  <img width="40px" height="40px" style="margin-bottom: 10px;" src="https://api.iconify.design/logos:paypal.svg" alt="PayPal"/>
</p>



-   [About](#about)
-   [Preview](#preview)
-   [Features](#features)
-   [Get Started](#get-started)
    -   [Postman Collection](#postman-collection)
    -   [Installation](#installation)
    -   [Deployment](#deployment)
-   [Contact](#contact)

## About

E-learning platform that brings together passionate instructors and curious learners from all around the world. With an extensive library of high-quality courses, ranging from programming and design to business and personal development.

## Preview
### Click the image below to view the showcase video
[![Introduction to My Project](https://i.postimg.cc/sXrNTZCb/Screenshot-from-2023-12-31-10-04-05.png)](https://player.vimeo.com/video/898858928)


## Features

- [x] Student Interface
 - [x] Instructor Dashboard Interface
 - [x] User Module
	 - [x] Register and Login
	 - [x] Login via Facebook, Google, and Linkedin
	 - [x] Verify Phone Number
	 - [x] Verify Email Address
	 - [x] Forget, Reset, and Change Password
 - [x] Course Module
 - [x] Lectures Module
	 - [x] Resources Up-loader
 - [x] Certificates
	 - [x] Fully Customized Configuration
     - [x] New Claim alert on email and notifications
     - [x] Certificate Checker
 - [x] Exam Module
	 - [x] Fully Customized
	 - [x] Question Answers
		 - [x] Open Answer
		 - [x] Single Choice
		 - [x] Multiple Choices
	 - [x] Exam Results
 - [x] Translation Module
	 - [x] CURD in database
	 - [x] Generating translation JSON files
 - [x] Payment Module
     - [x] Stripe Integration
     - [x] Paypal Integration
     - [x] Instructor Payout via Paypal
     - [x] Payment History
     - [x] Payment Log
 - [X] Built-in Real-time Chat System
 - [X] Notifications System

## Get Started

### Postman Collection

[Open With Postman](https://www.postman.com/petitfour/workspace/cursus-meester)

### Installation

#### 1. Clone The Repository

    git clone https://github.com/iSemary/cursus-meester

### Laravel Project
#### 2. Install Required Dependencies

    composer i

#### 3. Migrate Tables

    php artisan migrate
    php artisan module:migrate

#### 4. Install Passport Keys

    php artisan passport:install

#### 5. Run application local

    php artisan serve

### NextJS Project
#### 6. Navigate to front end folder

    cd resources/js

#### 7. Install Dependencies

    npm install

#### 8. Run application local

    npx next dev

#### 9. Convert SCSS to CSS

    sass resources/js/public/assets/css/style.scss:resources/js/public/assets/css/style.css
    sass resources/js/public/assets/css/panel.scss:resources/js/public/assets/css/panel.css

### NodeJS Project [websocket server]
    cd websocket
    npm install
    node server.js

### Deployment

#### 1. Auto Deploy with GitHub Actions on Master Branch
Simplify your deployment process by utilizing GitHub Actions for automatic deployment on pushing to the master branch. Set up your secrets variables in the repository:

All you have to do is to add your secrets variables into your repository: <br/>
1- VPS_SSH_KEY:
Generated access key for github to grant the privileges to write and read your server files

2- VPS_HOST:
for example 123.456.789

3- VPS_USERNAME:
for example ubuntu

4- PROJECT_DIRECTORY:
for example /var/www/

⚠️ Please note that the storage folder contains the courses files which is protected and requires a user authenticated token and also the user must be purchased the course.

#### 2. Manual Deploy
[Front End Side]
```bash
cd resources
```
```bash
npm run build
```
```bash
npm start
```
[Back End Side]
```bash
php artisan serve
```

#### ~ Backup Command [Backup Database and Files over cloud]

    php artisan app:backup

## Contact

For any inquiries or support, please email me at [abdelrahmansamirmostafa@gmail.com](mailto:abdelrahmansamirmostafa@gmail.com) or visit my website at [abdelrahman.online](https://www.abdelrahman.online/).
