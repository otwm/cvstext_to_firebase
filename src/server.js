import express from "express";
import multer from "multer";
import readExcel from "./excel";
import saveToFirebase from "./firebaseUtil";
import changeAge from "./dataRedefine/age";
import changeArtwork from "./dataRedefine/artwork";
import changeDisplayHistory from "./dataRedefine/displayHistory";
import changeAnalects from "./dataRedefine/analects";
import {
    getContent,
    startContentService,
    createContents,
    createContents4Interface,
    removeContents4Interface
} from "./service/interface";
import http from "http";
import socket from "socket.io";

const app = express();
const server = http.createServer(app);
const io = socket(server);
const contents4Interface = io.of('/contents4Interface');

io.on('connection', (socket) => {

});

contents4Interface.on('connection', (socket) => {
    console.log('connection interface!!!!');
    socket.on('disconnect', function(){
        console.log('interface disconnected');
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.xlsx');
    }
});

const upload = multer({storage: storage});

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/changeAge', (request, response) => {
    changeAge();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/changeArtwork', (request, response) => {
    changeArtwork();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/changeDisplayHistory', (request, response) => {
    changeDisplayHistory();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/changeAnalects', (request, response) => {
    changeAnalects();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/content', (request, response) => {
    response.status(200).end(JSON.stringify(getContent()));
});

app.get('/createContents', (request, response) => {
    createContents();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/createContents4Interface', (request, response) => {
    createContents4Interface();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/removeContents4Interface', (request, response) => {
    removeContents4Interface();
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('/test', (request, response) => {
    response.render('test');
});


app.post('/upload', upload.single('excel'), (request, response) => {
    console.log(request.body.domain);
    readExcel(
        request.file.path,
        request.body.domain,
        (datas) => {
            saveToFirebase(datas, request.body.domain);
        }
    );
    response.status(200).end(JSON.stringify({
        result: 'success'
    }));
});

app.get('*', (request, response) => {

});

server.listen(4000, () => {
    console.log('Express app listening on port 4000');
    startContentService();
});


// "https://firebasestorage.googleapis.com/v0/b/paik-5637b.appspot.com/o/images%2Fabc.jpg?alt=media&token=c6ff654a-be94-4a9d-825b-4f41941c3b9c"