import migrationRoute from "./migrationRoute";
import mainRoute from "./mainRoute";
import excelRoute from "./excelRoute";

const route = (app) => {
    mainRoute(app);
    migrationRoute(app);
    excelRoute(app);
};

export default route;
