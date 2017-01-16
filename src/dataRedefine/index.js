import {firebaseDatabase} from "fb/firebase";

let domainData = {};

const loadDomainData = () => {
    const peopleRef = firebaseDatabase.ref('/people');
    const cityRef = firebaseDatabase.ref('/city');
    peopleRef.once('value')
        .then((snapshot) => domainData.people = snapshot.val());
    cityRef.once('value')
        .then((snapshot) => domainData.city = snapshot.val());
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


export default change;