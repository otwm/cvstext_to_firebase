import express from "express";
import multer from "multer";
import readExcel from "./excel";
import saveToFirebase from './firebaseUtil';
import changeAge from './dataRedefine/age';
import changeArtwork from './dataRedefine/artwork';
import changeDisplayHistory from './dataRedefine/displayHistory';
import changeAnalects from './dataRedefine/analects';

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.xlsx');
    }
});

const upload = multer({storage: storage});

app.set('views', './');
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

app.listen(4000, () => {
    console.log('Express app listening on port 4000');
    // console.log(Excel);
});