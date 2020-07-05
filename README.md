# Restaurant Forum
A simple backstage management system of restaurant forums built with Node.js and Express.

## Features
1. Restaurants information management
2. User authority management
3. Log-in with local or Facebook account

![](https://i.imgur.com/ad9RpxQ.png)

## Getting Started
1. Clone repository to your local computer
```
$ git clone https://github.com/ShihTingJustin/restaurant-forum.git
```
2. Install by [npm](https://www.npmjs.com/)
```
$ npm install
```
3. Download env.example from [here](https://bit.ly/38vtO09)

4. Put **env.example** in root directory and rename to **.env** in editor 

5. Add your IMGUR CLIENTID, facebook ID and SECRET in **.env**
(You can apply from [facebook](https://developers.facebook.com/) and [imgur](https://imgur.com/))

6. Use seed data 
```
npx sequelize db:seed:all
```
7. Execute 
```
$ npm run dev 
```
8. Terminal show the message 
 ```
App is running on http://localhost:3000
```
Now you can browse the website on 
```
http://localhost:3000
```

## Test Account

```
Admin
email: root@example.com
password: 12345678
```
```
User
email: user1@example.com
password: 12345678
```

## Built With
* Node.js: 10.15.0
* bcryptjs: 2.4.3
* body-parser: 1.19.0
* connect-flash: 0.1.1
* dotenv: 8.2.0
* express: 4.17.1
* express-session: 1.17.1
* express-handlebars: 4.0.4
* faker: 4.1.0
* imgur-node-api: 0.1.0
* method-override: 3.0.0
* multer: 1.4.2
* mysql2: 2.1.0
* passport: 0.4.1
* passport-facebook: 3.0.0
* passport-local: 1.0.0
* pg: 8.2.1
* sequelize: 5.8.6
* sequelize-cli: 5.4.0

## Author
[Justin Huang 黃士庭](https://www.linkedin.com/in/justinhuang777/) 
