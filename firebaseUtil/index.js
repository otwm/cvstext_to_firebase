import {firebaseDatabase, serverTime} from "./firebase";

const partition = (_data, _filter) => {
    return _data.reduce(
        (l, r) => ( (_filter(r) ? l[0] : l[1]).push(r), l ),
        [[], []]
    );
};

const path = (domain) => {
    const domainPath = {
        People: "/people"
    };
    if (!domainPath[domain])throw '정의되지 않은 도메인';
    return domainPath[domain];
};

const saveToFirebase = (data, domain, resolve = () => {
    console.log('ok');
}, reject = (error) => {
    console.error(error)
}) => {
    const ref = firebaseDatabase.ref(path(domain));
    const partitioned = partition(data, _data => _data['id']);
    const pushFunc = data => {
        ref.push((function (serverTime) {
            console.log(`test ${data}`);
            data['createDate'] = serverTime;
            return data;
        })(serverTime), error => error ? reject(error) : resolve());
    };
    partitioned[1].forEach(pushFunc);
    ref.transaction(datas => {
        if (partitioned[0].length)return datas;
        return partitioned[0].filter(item => {
            if (!datas[item.id]) {
                console.error(`not exist item : ${item.id}`);
            }
            return datas[item.id];
        }).map(item => {
            return Object.assign({}, datas[item.id], item);
        });
    }).then(result => (console.log(result)));
};

export default saveToFirebase;
