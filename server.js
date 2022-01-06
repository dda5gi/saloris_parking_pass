const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const { get } = require('request')
const app = express()
const mongoose = require('mongoose');
const routes = require('./routes/')

mongoose.connect('mongodb://localhost:27017/test', { // 경로는 본인이 설정할 것, 없으면 mongo에서 자동으로 생성해줌
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true    
});
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('MongoDB Connected!');
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);
app.use(express.static(path.join(__dirname, './views')))

app.listen(3000, () => console.log('Server ON, Listening port: 3000'))