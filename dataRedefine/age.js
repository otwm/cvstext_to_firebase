import {firebaseDatabase} from "fb/firebase";
import change from "./index";

const changeAge = () => {
    change(firebaseDatabase.ref('/age'));
};

export default changeAge;