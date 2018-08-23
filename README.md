# messaging-app

GET IT UP AND RUNNING<br />
git clone https://github.com/tarun-bathwal/messaging-app.git<br />
cd messaging-app<br />
npm install<br />
nodemon<br />

The service is deployed on AWS. Find it at 18.223.118.198:3000/ <br />

APIs<br />
<br />
POST /register <br />
KEYS ( payload ) : firstname lastname email username password <br />
all the keys are string type and required while email is of email type <br />
send as x-www-form-urlencoded ( from postman ) <br />
registers a user possessing a unique username and email<br />
on successful registration, it returns<br />
{<br />
    "success": true,<br />
    "message": "sucessfully registered"<br />
}<br />
<br /><br />
POST /login<br />
KEYS ( payload ): email password<br />
send as x-www-form-urlencoded ( from postman )<br />
on sending POST request, token is received. keep this token safely ( in case front-end is up, store this token as cookie ) to be used as 'Authorization' header in further requests<br />
{<br />
    "success": "successfully logged in",<br />
    "token": "some token"<br />
}
<br /><br />
POST /sendmessage<br />
KEYS ( payload ): to subject content<br />
to is the username and not email of recepient , subject is optional while content is required. these 3 are of type string<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer. Quotations are not a part of the Authroization Header<br />
Content-Type : application/x-www-form-urlencoded<br />
on success , it returns <br />
{<br />
    "success": true,<br />
    "message": "sent the message to user1"<br />
}<br />
<br />
PUT /block/{username}<br />
blocks the person with the username passed, thus not allowing them to text the user who consumed this api.<br />
KEYS ( payload ): Keys are not required for this api<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
Content-Type : application/x-www-form-urlencoded<br />
NOTE : an example of this request would be /block/nick where nick is the username of the person to be blocked<br />
on sucess, it returns<br />
{<br />
    "success": true,<br />
    "message": "user3 has been blocked"<br />
}<br />
<br />
GET /inbox<br />
gets all the messages that were sent to the user who consumed this api.<br />
send HEADERS as follows<br />
Authorization : "bearer "+ token //token is the same received token while logging in, mind the space after the word bearer<br />
on success, it returns<br />
{<br />
    "success": true,<br />
    "message": [<br />
        {<br />
            "from": "user2",<br />
            "subject": "hi. i am subject",<br />
            "content": "hi. i am message"<br />
        }<br />
    ]<br />
}<br />
<br />
NOTE : the source code contains a lot of codes commented. They were actually implementation of email verification of users when registering i.e, on registration, they would get a link upon clicking which would confirm their registration. However, to enable this facility, you need to make a .env file and add these two lines to it <br />
ID=your_id@gmail.com<br />
PASWD=your_password<br />
Also, you need to turn off 2 factor authentication on every login on your gmail id, if it was previously enabled and also allow less trusted parties to allow logins. Only after doing these steps and uncommenting out the codes in controllers/user.js and models/user.js , would email verification work. Since this is tedious, I have for now removed this feature.<br />




