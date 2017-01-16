import {firebaseDatabase} from "fb/firebase";
import Immutable from "immutable";

const age = firebaseDatabase.ref('/age');
const analects = firebaseDatabase.ref('/analects');
const artwork = firebaseDatabase.ref('/artwork');
const displayHistory = firebaseDatabase.ref('/displayHistory');
const content = firebaseDatabase.ref('/content');
const contents4Interface = firebaseDatabase.ref('/contents4Interface');

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

const findDomainByKey = (domainName, key) => {
    if (!domainData[domainName][key])return '';
    return domainData[domainName][key];
};

/**
 * 처음 접속 시
 */
export const startContentService = () => {

};

const convert = (item) => {
    if (item.people) {
        item.people = findDomainByKey(
            'people', item.people
        );
    }

    if (item.locations) {
        item.locations = item.locations
            .map(location => {
                if (!location.city)return location;
                location.city = findDomainByKey(
                    'city', location.city
                );
                return location;
            });
    }
    return item;
};

// if(is4Interface){
//     contents4Interface.remove();
// }else{
//     content.remove();
// }
export const removeContents4Interface = () => {
    contents4Interface.remove().catch(e => console.error(e));
}

const createLogic = (is4Interface) => {

    Promise.all([
        age.once('value').then((snapshot) => snapshot.val()),
        analects.once('value').then((snapshot) => snapshot.val()),
        artwork.once('value').then((snapshot) => snapshot.val()),
        displayHistory.once('value').then((snapshot) => snapshot.val())
    ]).then(results => {
        const type = (index) => {
            switch (index) {
                case 0:
                    return 'age';
                case 1:
                    return 'analects';
                case 2:
                    return 'artwork';
                case 3:
                    return 'displayHistory';
            }
        };

        const temp = results.map((item, index) => {
            let result = [];
            for (let key in item) {
                result.push({
                    type: type(index),
                    data: item[key],
                    order: 0,
                    key: key
                });
            }
            return result;
        });

        Immutable.fromJS(temp).flatten(true).sort((item1, item2) => {
            const val = (map, prop, maxValue = 9999) => {
                const value = map.getIn(['data', prop], maxValue) + '';
                if (value === '')return maxValue;
                return parseInt(value, 10);
            };
            if (val(item1, 'age') > val(item2, 'age')) return 1;
            if (val(item1, 'age') < val(item2, 'age')) return -1;
            if (val(item1, 'start_year') > val(item2, 'start_year')) return 1;
            if (val(item1, 'start_year') < val(item2, 'start_year')) return -1;
            if (val(item1, 'start_month') > val(item2, 'start_month')) return 1;
            if (val(item1, 'start_month') < val(item2, 'start_month')) return -1;
            if (val(item1, 'start_day') > val(item2, 'start_day')) return 1;
            if (val(item1, 'start_day') < val(item2, 'start_day')) return 1;
            if (val(item1, 'name', "+") > val(item2, 'name', "+")) return 1;
            if (val(item1, 'name', "+") < val(item2, 'name', "+")) return -1;

            return 0;
        }).map(item => item.toJSON()).forEach((item, index) => {
            item.order = index;
            if (is4Interface) {
                item.data = convert(item.data);
                contents4Interface.push(item)
                    .catch(error => console.error(error));
            } else {
                content.push(item).catch(error => console.error(error));
            }
            console.log(` index : ${index}`);
        });
    }).catch(error => error);
};

export const createContents = () => {
    createLogic();
};

export const createContents4Interface = () => {
    createLogic(true);
};


export const getContent = () => {
    //TODO: impl
};
