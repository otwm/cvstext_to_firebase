import firebase from "firebase";
import {config} from "./config";

/**
 * firebase app shotcut
 * @type {firebase.app.App|firebase.app.App}
 */
export const firebaseApp = firebase.initializeApp(config);

/**
 * firebase database shotcut
 * @type {firebase.database.Database|firebase.database.Database}
 */
export const firebaseDatabase = firebaseApp.database();


/**
 * firebase auth shotcut
 * @type {any}
 */
export const firebaseAuth = firebaseApp.auth();

export const serverTime = firebase.database.ServerValue.TIMESTAMP;

// firebase.database.enableLogging(true, true);