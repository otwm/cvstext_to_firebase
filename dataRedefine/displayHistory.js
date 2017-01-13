import {firebaseDatabase} from "fb/firebase";
import change from "./index";

const changeDisplayHistory = () => {
    change(firebaseDatabase.ref('/displayHistory'));
};

export default changeDisplayHistory;