import upload from "/core/upload";
import readExcel from "/excel";
import saveToFirebase from "/firebaseUtil";
import {domainHook, propertiesCallBacks} from "/domain";

const excelRoute = (app) => {
    app.post('/upload', upload.single('excel'), (request, response) => {
        console.log(request.body.domain);
        const operations = (function () {
            let result = {};
            if (domainHook[request.body.domain]) {
                result["hook"] = domainHook[request.body.domain];
            }
            if (propertiesCallBacks(request.body.domain)) {
                result["propertiesCallBacks"] = propertiesCallBacks(request.body.domain);
            }
            return result;
        })();
        readExcel(
            request.file.path,
            request.body.domain,
            (datas) => {
                saveToFirebase(datas, request.body.domain, operations);
            }
        );
        response.status(200).end(JSON.stringify({
            result: 'success'
        }));
    });

};

export default excelRoute;
