import {firebaseDatabase, serverTime} from "./firebase";
import {getDomainPath} from "/domain";
import {fb} from "/core/util/basic";

const partition = (_data, _filter) => {
    return _data.reduce(
        (l, r) => ( (_filter(r) ? l[0] : l[1]).push(r), l ),
        [[], []]
    );
};

const saveToFirebase = (data, domain, {
    resolve = () => {
    },
    reject = (error) => {
        console.error(error)
    }, propertiesCallBacks, hook
}) => {
    const ref = firebaseDatabase.ref(getDomainPath(domain));
    const partitioned = partition(data, _data => _data['id']);
    const pushFunc = data => {
        ref.push((function (serverTime) {
            data['createDate'] = serverTime;
            if (propertiesCallBacks) {
                for (let prop in propertiesCallBacks) {
                    if (!fb.isNull(data[prop])) {
                        data[prop] = propertiesCallBacks[prop](data);
                    }
                }
            }
            return data;
        })(serverTime), error => error ? reject(error) : resolve());
    };
    partitioned[1].forEach(pushFunc);
    if (partitioned[0].length) {
        ref.transaction(datas => {
            return partitioned[0].filter(item => {
                if (!datas[item.id]) {
                    console.error(`not exist item : ${item.id}`);
                }
                return datas[item.id];
            }).map(item => {
                return Object.assign({}, datas[item.id], item);
            });
        }).then(result => (console.log(result)));
    }
    if (hook) hook(data);
};

export default saveToFirebase;
