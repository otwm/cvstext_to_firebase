import changeAge from "/dataRedefine/age";
import changeArtwork from "/dataRedefine/artwork";
import changeDisplayHistory from "/dataRedefine/displayHistory";
import changeAnalects from "/dataRedefine/analects";
import {createContents, createContents4Interface, removeContents4Interface} from "/service/interface";

const migrationRoute = (app) => {

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
};

export default migrationRoute;
