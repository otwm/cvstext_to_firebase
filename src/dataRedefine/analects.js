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
    item.people = findKey(
        'people',
        (data) => data.name.trim() == item.people.trim()
    );
    return item;
};

const change = (ref) => {
    ref.transaction(datas => {
        for (let key in datas) {
            datas[key] = convert(datas[key]);
            // console.log(convert(datas[key]));
        }
        return datas;
    }).then(result => (console.log(result)));
};


const changeAnalects = () => {
    change(firebaseDatabase.ref('/analects'));
};

export default changeAnalects;