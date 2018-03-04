# offhaul
It is a web app for moving (hauling :smirk:) your email and accounts with a few simple clicks from one provider to another. This includes emails and sub directory structures, notes, contacts and calendars.

With this open source project I am trying to improve my abilities with MongoDB, Node.js and its eco system. At the same time I want to offer a **free and open solution for anyone** to move their accounts as easy as possible.

__I appreciate any **help** you can offer to improve the code and help me better my programming skills.__

## Requirements:

* Installed [git](https://git-scm.com/)
* Installed [Node.js](https://nodejs.org) >= 9.4.0
* A running [MongoDB](https://www.mongodb.com/) instance. I recommend [mlab.com](https://mlab.com/), which is free up to 500MB and you don't have to enter any credit card information.

## Installation
Local installation for Mac and Linux Systems:

* **For locally run**: 
  * ```git clone https://github.com/CodeCook83/offhaul.git```
  * ```cd offhaul```
  * ```npm install```
  * ```cp config/keys_prod.js config/keys_dev.js```
  * Edit `keys_dev.js` as follows and fill in your data
  ```javascript
      module.exports = {
        mongoURI : 'mongodb://<user>:<password>@<server>/offhaul-dev',
        googleClientID: 'your code',
        googleClientSecret: 'your code',
        facebookClientID: 'your code',
        facebookClientSecret: 'your code',
        twitterClientID : 'your code',
        twitterClientSecret: 'your code',
        sessionSecret: 'your code',
        mailUser: 'your code',
        mailPassword: 'your code',
        mailSmtp: 'your code',
        mailPort: 'your code'
      }
  ```
  * run ```nodemon```
  * Visit the site on [http://localhost:5000](http://localhost:5000)

* **For server run** - e.g. [Heroku](https://www.heroku.com/)
  * On Mac:
    * Install [```brew```](https://brew.sh/)
    * ```brew install heroku/brew/heroku```
  * On Linux
    * ```wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh```
  * In the terminal: ```heroku login``` --> email and password
  * ```git clone https://github.com/CodeCook83/offhaul.git```
  * ```cd offhaul```
  * ```heroku create```
  * fill your data in `scripts/heroku_set_config_vars.sh` then
  * ```chmod +x heroku_set_config_vars.sh```
  * ```./heroku_set_config_vars.sh```
  * ```heroku git:remote -a <your app name>```
  * ```git push heroku master```
  * ```heroku open```
  * visit your heroku side

Have fun!