import migrationRoute from "./migrationRoute";
import mainRoute from "./mainRoute";
import excelRoute from "./excelRoute";

const route = (app) => {
    migrationRoute(app);
    excelRoute(app);
    mainRoute(app);
};

export default route;
