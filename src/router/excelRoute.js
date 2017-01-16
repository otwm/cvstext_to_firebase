import upload from "/core/upload";
import readExcel from "/excel";
import saveToFirebase from "/firebaseUtil";

const excelRoute = (app) => {
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

};

export default excelRoute;
