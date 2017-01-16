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
import route from './router';
export const app = express();
const server = http.createServer(app);
const io = socket(server);
const contents4Interface = io.of('/contents4Interface');

route(app);

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



server.listen(4000, () => {
    console.log('Express app listening on port 4000');
    startContentService();
});


// "https://firebasestorage.googleapis.com/v0/b/paik-5637b.appspot.com/o/images%2Fabc.jpg?alt=media&token=c6ff654a-be94-4a9d-825b-4f41941c3b9c"