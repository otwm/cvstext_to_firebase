import People from "./People";
import City from "./City";
import Age from "./Age";
import Artwork from "./Artwork";
import DisplayHistory from "./DisplayHistory";
import Analects from "./Analects";
import Document from "./Document";


const info = {
    People: People,
    City:City,
    Age:Age,
    Artwork:Artwork,
    DisplayHistory:DisplayHistory,
    Analects:Analects,
    Document:Document
};

export const domainPath = {
    People: "/people"
};
export default info;