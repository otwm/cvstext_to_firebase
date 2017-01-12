import {firebaseDatabase, serverTime} from "./firebase";

/**
 * 파이어 베이스 리스트
 */
export class FirebaseList {

    /**
     *
     * @param actions 리스트의 기본 이벤트 핸들러 액션
     * @param model
     * @param path
     */
    constructor(actions, model, path = null) {
        this._actions = actions;
        this._model = model;
        this._path = path;
    }

    /**
     * 경로
     * @returns {*}
     */
    get path() {
        return this._path;
    }

    /**
     * 경로 지정
     * @param path
     */
    set path(path) {
        this._path = path;
    }

    /**
     * 생성
     * @param value
     * @returns {Promise}
     */
    push(value) {
        return new Promise((resolve, reject) => {
            firebaseDatabase.ref(this._path)
                .push((function (serverTime) {
                    value['createDate'] = serverTime;
                    console.log('value : ' + value);
                    return value;
                })(serverTime), error => error ? reject(error) : resolve());
        });
    }

    /**
     *
     * @param id
     * @returns {Promise}
     */
    remove(id) {
        return new Promise((resolve, reject) => {
            firebaseDatabase.ref(`${this._path}/${id}`)
                .remove(error => error ? reject(error) : resolve());
        });
    }

    /**
     *
     * @param id
     * @param value
     * @returns {Promise}
     */
    set(id, value) {
        return new Promise((resolve, reject) => {
            firebaseDatabase.ref(`${this._path}/${id}`)
                .set(value, error => error ? reject(error) : resolve());
        });
    }

    update(id, value) {
        return new Promise((resolve, reject) => {
            firebaseDatabase.ref(`${this._path}/${id}`)
                .update(
                    (function (serverTime) {
                        value['updateDate'] = serverTime;
                        console.log('value : ' + value);
                        return value;
                    })(serverTime), error => error ? reject(error) : resolve());
        });
    }

    /**
     * 구독
     * action은 onLoad가 존재하여야 한다.
     * @param emit
     */
    subscribe(emit,
              onLoadStart,
              onLoadEnd = () => {
                  console.log('loaded!');
              }) {
        let ref = firebaseDatabase.ref(this._path);
        let initialized = false;

        let list = [];

        if (onLoadStart) onLoadStart();

        ref.once('value', () => {
            initialized = true;
            emit(this._actions.onLoad(list));//action은 onLoad가 존재하여야 한다.
        }).then(onLoadEnd);


        ref.on('child_added', snapshot => {
            if (initialized) {
                emit(this._actions.onAdd(this.unwrapSnapShot(snapshot)));
            } else {
                list.push(this.unwrapSnapShot(snapshot));
            }
        });

        ref.on('child_changed', snapshot => {
            emit(this._actions.onChange(this.unwrapSnapShot(snapshot)));
        });

        ref.on('child_removed', snapshot => {
            emit(this._actions.onRemove(this.unwrapSnapShot(snapshot)));
        });

        this._unsubscibe = () => ref.off();
    }

    /**
     * 구독 해제
     */
    unsubscibe() {
        this._unsubscibe();
    }

    /**
     *
     * @param snapshot
     * @returns {*}
     */
    unwrapSnapShot(snapshot) {
        let data = snapshot.val();
        data.id = snapshot.key;
        return new this._model(data);
    }

}