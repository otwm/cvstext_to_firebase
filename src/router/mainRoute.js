const mainRoute = (app) => {
    app.get('/', (request, response) => {
        response.render('index');
    });

    app.get('*', (request, response) => {

    });
};

export default mainRoute;
