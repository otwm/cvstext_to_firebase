import {firebaseDatabase} from "fb/firebase";
import People from "./People";
import City from "./City";
import Age from "./Age";
import Artwork from "./Artwork";
import DisplayHistory from "./DisplayHistory";
import Analects from "./Analects";
import Document from "./Document";
import Images from "./Images";
import {changeAge, changeArtwork, changeDisplayHistory, changeAnalects} from "/dataRedefine";

const info = {
    People: People,
    City: City,
    Age: Age,
    Artwork: Artwork,
    DisplayHistory: DisplayHistory,
    Analects: Analects,
    Document: Document,
    Images: Images
};

export const domainPath = {
    People: "/people",
    City: "/city",
    Age: "/age",
    Artwork: "/artwork",
    DisplayHistory: "/displayHistory",
    Analects: "/analects",
    Document: "/document",
    Images: "/images"
};

export const domainHook = {
    Age: changeAge,
    Artwork: changeArtwork,
    DisplayHistory: changeDisplayHistory,
    Analects: changeAnalects
};

export const getDomainPath = (domain) => {
    if (!domainPath[domain])throw '정의되지 않은 도메인';
    return domainPath[domain];
};

export const loadDomainData = () => {
    let domainData = {};
    const peopleRef = firebaseDatabase.ref('/people');
    const cityRef = firebaseDatabase.ref('/city');
    const imagesRef = firebaseDatabase.ref('/images');
    peopleRef.once('value')
        .then((snapshot) => domainData.people = snapshot.val());
    cityRef.once('value')
        .then((snapshot) => domainData.city = snapshot.val());
    imagesRef.once('value')
        .then((snapshot) => domainData.images = snapshot.val());
    return domainData;
};

export const propertiesCallBacks = (domain) => {
    switch (domain) {
        case "Images":
            return {
                links: (data) => {
                    return {0: data["links"]}
                }
            };
        default:
            return null;
    }
};

export default info;

