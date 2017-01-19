import {firebaseDatabase} from "fb/firebase";
import Immutable from "immutable";
import {loadDomainData} from "/domain";
import {wsConnections} from "/server";

const ageRef = firebaseDatabase.ref('/age');
const analectsRef = firebaseDatabase.ref('/analects');
const artworkRef = firebaseDatabase.ref('/artwork');
const displayHistoryRef = firebaseDatabase.ref('/displayHistory');
const content = firebaseDatabase.ref('/content');
const contents4InterfaceRef = firebaseDatabase.ref('/contents4Interface');

const people = firebaseDatabase.ref('/people');
const images = firebaseDatabase.ref('/images');
const city = firebaseDatabase.ref('/city');
const movie = firebaseDatabase.ref('/movie');

const domainData = loadDomainData();

const findDomainByKey = (domainName, key) => {
    if (!domainData[domainName][key])return '';
    return domainData[domainName][key];
};

const dataType = (domain) => {
    if (domain === "age") return "domain";
    if (domain === "analects") return "domain";
    if (domain === "artwork") return "domain";
    if (domain === "displayHistory") return "domain";

    if (domain === "people") return "basic";
    if (domain === "images") return "basic";
    if (domain === "city") return "basic";
    if (domain === "movies") return "basic";

    if (domain === "contents4Interface") return "interface";
    throw '정의되지 않은 타입';
};

const noticeAndUpdate = ({domain, key, value}) => {
    const _assignForDomain = (oldValue, newValue) => {
        for (let key in oldValue) {
            if (!["people", "locations", "city", "images", "movies"].includes(key)) {
                oldValue[key] = newValue[key];
            }
        }
        return oldValue;
    };

    const _assignForBasic = (oldValue, newValue, domain) => {
        oldValue[domain] = value;
        return oldValue;
    };

    const _noticeAndUpdate = (snapshot, assign) => {
        const data = Object.values(snapshot.val())[0];
        const key = Object.keys(snapshot.val())[0];
        const newData = assign(Object.assign({}, data.data), value, domain);

        const newValue = Object.assign({}, snapshot.val(), newData);
        wsConnections.forEach(connection => connection.send(JSON.stringify(newValue)));
        firebaseDatabase.ref(`/contents4Interface/${key}/data`).update(newData);
    };

    if (dataType(domain) === "domain") {
        contents4InterfaceRef.orderByChild("key").equalTo(key).once("value", (snapshot) => {
            _noticeAndUpdate(snapshot, _assignForDomain);
        });
    } else if (dataType(domain) === "basic") {
        [
            ageRef,
            analectsRef,
            artworkRef,
            displayHistoryRef
        ].forEach(ref => {
            ref.orderByChild(domain).equalTo(key).once("value", (snapshot) => {
                if (!snapshot.val())return;
                const key = Object.keys(snapshot.val())[0];
                contents4InterfaceRef.orderByChild("key").equalTo(key).once("value", (snapshot) => {
                    _noticeAndUpdate(snapshot, _assignForBasic);
                });
            });
        });
    }
};

const loaded = {
    age: false,
    analects: false,
    artwork: false,
    displayHistory: false,
    people: false,
    images: false,
    city: false
};

/**
 * 처음 접속 시
 */
export const startContentService = () => {
    [
        ageRef
        , analectsRef
        , artworkRef
        , displayHistoryRef
    ].forEach((ref) => {
        ref.on('child_changed', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.on('child_removed', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.on('child_moved', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.limitToLast(1).on('child_added', (snapshot) => {
            if (!loaded[ref.key]) {
                loaded[ref.key] = true;
            } else {
                const value = snapshot.val();
                noticeAndUpdate({
                    domain: ref.key,
                    key: snapshot.key,
                    value
                });
            }
        })
    });

    [
        people
        , images
        , city
    ].forEach((ref) => {
        ref.on('child_changed', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.on('child_removed', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.on('child_moved', (snapshot) => {
            const value = snapshot.val();
            noticeAndUpdate({
                domain: ref.key,
                key: snapshot.key,
                value
            });
        });

        ref.limitToLast(1).on('child_added', (snapshot) => {
            if (!loaded[ref.key]) {
                loaded[ref.key] = true;
            } else {
                const value = snapshot.val();
                noticeAndUpdate({
                    domain: ref.key,
                    key: snapshot.key,
                    value
                });
            }
        });
    });
};

const convert = (item) => {
    if (item.images) {
        item.images = findDomainByKey(
            'images', item.images
        );
    }

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

export const removeContents4Interface = () => {
    contents4InterfaceRef.remove().catch(e => console.error(e));
}

const createLogic = (is4Interface) => {

    Promise.all([
        ageRef.once('value').then((snapshot) => snapshot.val()),
        analectsRef.once('value').then((snapshot) => snapshot.val()),
        artworkRef.once('value').then((snapshot) => snapshot.val()),
        displayHistoryRef.once('value').then((snapshot) => snapshot.val())
    ]).then(results => {
        /**
         * 프라미스 인자에 따른 타입 정의
         * @param index
         * @returns {*}
         */
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

        /**
         * 컨텐츠 리스트 작성
         */
        const contents = results.map((item, index) => {
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

        Immutable.fromJS(contents).flatten(true).sort((item1, item2) => {
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
                contents4InterfaceRef.push(item)
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

export const stringConvert = () => {
    const isTarget = (data) => {
        for (let [key, value] of Object.entries(data)) {
            if (typeof value === "number" && key !== "createDate")return true;
        }
        return false;
    };

    const convert = (data) => {
        for (let [key, value] of Object.entries(data)) {
            if (typeof value === "number" && key !== "createDate") {
                data[key] = value + '';
            }
        }
        return data;
    };

    [
        ageRef
        , analectsRef
        , artworkRef
        , displayHistoryRef
        , content
        , contents4InterfaceRef
    ].forEach((ref) => {
        console.log(ref);
        ref.transaction(dataObject => {
            if (dataObject) {
                for (let [key, value] of Object.entries(dataObject)) {
                    if (isTarget(value)) {
                        dataObject[key] = convert(value);
                    }
                }
            }
            return dataObject;
        });
    });
};