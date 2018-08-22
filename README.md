# messaging-app

GET IT UP AND RUNNING<br />
git clone https://github.com/tarun-bathwal/messaging-app.git<br />
cd messaging-app<br />
npm install<br />
nodemon<br />

PREREQUISITE : add your email id and password in controllers/user.js file in smtpTransport function to enable sending emails for email verification without which registration is not possible. <br />

APIs<br />
<br />
POST /register <br />
KEYS : firstname lastname email username password <br />
send as x-www-form-urlencoded ( from postman ) <br />
Go to your mailbox and click on the link to complete registration. If this is not done, registration will not be completed.
<br /><br />
POST /login<br />
KEYS : email password<br />
send as x-www-form-urlencoded ( from postman )<br />
on sending POST request, token is received. keep this token safely ( in case front-end is up, store this token as cookie )
<br /><br />
POST /sendmessage<br />
KEYS send as x-www-form-urlencoded ( from postman ) : to subject content<br />
to is the username of recepient , subject is optional while content is required.<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
Content-Type : application/x-www-form-urlencoded<br />
<br />
PUT /block/{username}<br />
KEYS : not required<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
Content-Type : application/x-www-form-urlencoded<br />
what it does : blocks the person with the username passed, thus not allowing them to text the user who consumed this api.<br />
NOTE : an example of this request would be /block/nick where nick is the username of the person to be blocked<br />
<br />
get /inbox<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
what it does : gets all the messages that were sent to the user who consumed this api.<br />



