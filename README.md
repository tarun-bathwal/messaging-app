# messaging-app

GET IT UP AND RUNNING
git clone https://github.com/tarun-bathwal/messaging-app.git
cd messaging-app
npm install
nodemon

PREREQUISITE : add your email id and password in controllers/user.js file in smtpTransport function to enable sending emails for email verification without which registration is not possible.

APIs

POST /register
KEYS : firstname lastname email username password
send as x-www-form-urlencoded ( from postman )
Go to your mailbox and click on the link to complete registration. If this is not done, registration will not be completed.

POST /login
KEYS : email password
send as x-www-form-urlencoded ( from postman )
on sending POST request, token is received. keep this token safely ( in case front-end is up, store this token as cookie )

POST /sendmessage
KEYS send as x-www-form-urlencoded ( from postman ) : to subject content
to is the username of recepient , subject is optional while content is required.
send HEADERS as follows
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer
Content-Type : application/x-www-form-urlencoded

PUT /block/{username}
KEYS : not required
send HEADERS as follows
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer
Content-Type : application/x-www-form-urlencoded
what it does : blocks the person with the username passed, thus not allowing them to text the user who consumed this api.
NOTE : an example of this request would be /block/nick where nick is the username of the person to be blocked

get /inbox
send HEADERS as follows
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer
what it does : gets all the messages that were sent to the user who consumed this api.



