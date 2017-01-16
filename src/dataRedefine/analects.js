import {firebaseDatabase} from "fb/firebase";
import change from "./index";

const changeAnalects = () => {
    change(firebaseDatabase.ref('/analects'));
};

export default changeAnalects;