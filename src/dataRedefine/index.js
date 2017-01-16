import {firebaseDatabase} from "fb/firebase";

import changeAnalects from "./analects";
import changeArtwork from "./artwork";
import changeDisplayHistory from "./displayHistory";

let domainData = {};

const loadDomainData = () => {
    const peopleRef = firebaseDatabase.ref('/people');
    const cityRef = firebaseDatabase.ref('/city');
    const imagesRef = firebaseDatabase.ref('/images');
    peopleRef.once('value')
        .then((snapshot) => domainData.people = snapshot.val());
    cityRef.once('value')
        .then((snapshot) => domainData.city = snapshot.val());
    imagesRef.once('value')
        .then((snapshot) => domainData.images = snapshot.val());
};

loadDomainData();

const findKey = (domainName, compare) => {
    for (let key in domainData[domainName]) {
        if (compare(domainData[domainName][key])) {
            return key;
        }
    }
    return '';
};

const convert = (item) => {
    if (item.images) {
        item.images = findKey(
            'images',
            (data) => data.caption.trim() == item.images.trim()
        );
    }

    if (item.people) {
        item.people = findKey(
            'people',
            (data) => data.name.trim() == item.people.trim()
        );
    }

    if (item.locations) {
        let location = {};
        location.address = item.locations;
        location.city = findKey(
            'city',
            (data) => data.name.trim() == (item.city + '').trim()
            || data.nameEn.trim() == (item.city + '').trim()
        );
        item.locations = {0: location};
    }
    delete item.city;
    return item;
};

const change = (ref) => {
    ref.transaction(datas => {
        for (let key in datas) {
            datas[key] = convert(datas[key]);
        }
        return datas;
    }).then(result => (console.log(result)));
};

//이상하게 export 가 안되네??
export const changeAge = () => {
    change(firebaseDatabase.ref('/age'));
};

export {changeAnalects};
export {changeArtwork};
export {changeDisplayHistory};

export default change;


