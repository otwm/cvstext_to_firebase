import multer from "multer";
import readExcel from "/excel";
import saveToFirebase from "/firebaseUtil";
import changeAge from "/dataRedefine/age";
import changeArtwork from "/dataRedefine/artwork";
import changeDisplayHistory from "/dataRedefine/displayHistory";
import changeAnalects from "/dataRedefine/analects";
import {getContent, createContents, createContents4Interface, removeContents4Interface} from "/service/interface";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.xlsx');
    }
});
const upload = multer({storage: storage});


const route = (app) => {
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
};

export default route;