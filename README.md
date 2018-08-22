# messaging-app

GET IT UP AND RUNNING<br />
git clone https://github.com/tarun-bathwal/messaging-app.git<br />
cd messaging-app<br />
npm install<br />
nodemon<br />

APIs<br />
<br />
POST /register <br />
KEYS : firstname lastname email username password <br />
send as x-www-form-urlencoded ( from postman ) <br />
registers a user
<br /><br />
POST /login<br />
KEYS : email password<br />
send as x-www-form-urlencoded ( from postman )<br />
on sending POST request, token is received. keep this token safely ( in case front-end is up, store this token as cookie )
<br /><br />
POST /sendmessage<br />
KEYS : to subject content<br />
to is the username of recepient , subject is optional while content is required.<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
Content-Type : application/x-www-form-urlencoded<br />
<br />
PUT /block/{username}<br />
blocks the person with the username passed, thus not allowing them to text the user who consumed this api.<br />
KEYS : not required<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
Content-Type : application/x-www-form-urlencoded<br />
NOTE : an example of this request would be /block/nick where nick is the username of the person to be blocked<br />
<br />
get /inbox<br />
gets all the messages that were sent to the user who consumed this api.<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
<br />
NOTE : the source code contains a lot of codes commented. They were actually implementation of email verification of users when registering i.e, on registration, they would get a link upon clicking which would confirm their registration. However, to enable this facility, you need to make a .env file and add these two lines to it <br />
ID=your_id@gmail.com<br />
PASWD=your_password<br />
Also, you need to turn off 2 factor authentication on every login on your gmail id, if it was previously enabled and also allow less trusted parties to allow logins. Only after doing these steps and uncommenting out the codes in controllers/user.js and models/user.js , would email verification work. Since this is tedious, I have for now removed this feature.<br />




