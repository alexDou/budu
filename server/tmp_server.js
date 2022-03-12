var http = require('http');

const data = [{
    user: {
        username: 'rxJoe',
        login: 'rxbud',
        password: '123qwe',
        email: 'al@mail.ru',
    },
    profile: {
        about: 'this is about me',
        address: '20d south city, RU',
    }
}];

http.createServer(function (req, res) {
    res.json(data);
    res.end();
    console.log('data has been sent');
}).listen(8000, function(){
    console.log("server start at port 8000");
});
