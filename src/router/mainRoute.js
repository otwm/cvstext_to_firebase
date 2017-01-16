const mainRoute = (app) => {
    app.get('/', (request, response) => {
        response.render('index');
    });
    app.get('*', (request, response) => {
        response.status(404).end(JSON.stringify({
            result: '404'
        }));
    });
};

export default mainRoute;
