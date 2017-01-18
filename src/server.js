import express from "express";
import {startContentService} from "./service/interface";
import http from "http";
import route from "./router";
// import url from "url";
// import WebSocket from "ws";
import {server as WebSocketServer} from "websocket";
// import resizeImage from "resize-image";
// import ImageResize from 'node-image-resize';
import fs from 'fs';
import path from 'path';

import easyimg from 'easyimage';



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


// var img = new Image();
// img.onload= function () {
//     var data = resizeImage.resize(img, 200, 100, resizeImage.PNG);
//     console.log(data);
// };
// img.src = url; // local image url


var k = () => {
    // easyimg

    easyimg.info('./3.jpg').then(
        function(file) {
            console.log(file);
        }, function (err) {
            console.log(err);
        }
    );


    easyimg.rescrop({
        src:'./3.jpg', dst:'./kitten-thumbnail.jpg',
        width:300, height:300,
        cropwidth:300, cropheight:300,
        x:0, y:0
    }).then(
        function(image) {
            console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
        },
        function (err) {
            console.log(err);
        }
    );


    // var image = new ImageResize(path.join(__dirname, '3.jpg'));
    // console.log(image);
    // image.loaded().then(function () {
    //     console.log('loaded');
    //     image.smartResizeDown({
    //         width: 400,
    //         height:400
    //     }).then(function () {
    //         console.log('converted');
    //
    //         image.stream(function (err, stdout, stderr) {
    //             console.log(err);
    //             console.log(path.join(__dirname,'small1.jpg'));
    //         var writeStream = fs.createWriteStream(path.join(__dirname,'small1.jpg'));
    //         stdout.pipe(writeStream);
    //             console.log('23232');
    //         });
    //     }).catch((e) => {
    //         console.error('1111111111');
    //         console.error(e);
    //     });
    // });
}

// setTimeout(k,1);