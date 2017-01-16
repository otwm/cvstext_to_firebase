import express from "express";
import {startContentService} from "./service/interface";
import http from "http";
import socket from "socket.io";
import route from "./router";

export const app = express();
const server = http.createServer(app);
const io = socket(server);

route(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

server.listen(4000, () => {
    console.log('Express app listening on port 4000');
    startContentService();
});