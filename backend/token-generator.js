const jwt = require('jsonwebtoken')

const SECRET_KEY = 'Du78Y7RGWBEFDSLNFDS3R43290*(&Y77H';

const token = jwt.sign(
    {
        name: 'Mario',
    },
    SECRET_KEY,
    {
        expiresIn: '1y',
        subject: '1'
    }
);

const TOKEN_GERADO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaW8iLCJpYXQiOjE2ODM1ODQwNTMsImV4cCI6MTcxNTE0MTY1Mywic3ViIjoiMSJ9.YdLxkdWMKpP_WzHa-8owwJSHn47Yc48JJXBS_13f6jE';

 //console.log(jwt.verify(TOKEN_GERADO, SECRET_KEY + 'dd'));
 console.log(jwt.decode(TOKEN_GERADO, SECRET_KEY));

//console.log(token)