import express from "express";
import {startContentService} from "./service/interface";
import http from "http";
import route from "./router";
// import url from "url";
// import WebSocket from "ws";
import {server as WebSocketServer} from "websocket";

export const app = express();
const server = http.createServer(app);

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function (request) {
    try {
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });

    } catch (e) {
        console.error(e);
    }
});

export const wsConnections = wsServer.connections;

route(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

server.listen(4000, () => {
    console.log('Listening on %d', server.address().port);
    startContentService();

});