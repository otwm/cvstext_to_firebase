import {firebaseDatabase} from "fb/firebase";
import change from "./index";

const changeArtwork = () => {
    change(firebaseDatabase.ref('/artwork'));
};

export default changeArtwork;