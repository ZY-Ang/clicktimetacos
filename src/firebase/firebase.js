/**
 * Configuration for firebase and firebase instantiation.
 */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

/** 1. Config parameters retrieved from firebase console at
 * {@link https://clicktimetacos.firebaseio.com}
 */
const config = {
    apiKey: "AIzaSyBruXgd2MFQXHIMlIdhA3xij_RvrFZBTVM",
    authDomain: "clicktimetacos.firebaseapp.com",
    databaseURL: "https://clicktimetacos.firebaseio.com",
    projectId: "clicktimetacos",
    storageBucket: "clicktimetacos.appspot.com",
    messagingSenderId: "916601477750"
};

/** 2. Initialize application using the provided {@see config} */
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

/** 3. Retrieve and make available
 * {@code firebase.auth()} module,
 * {@code firebase.database()} module,
 * {@code firebase.database} namespace,
 *  to other modules in application
 */
const auth = firebase.auth();
const authServices = firebase.auth;
const dbase = firebase.database();
const databaseServices = firebase.database;

export {
    auth,
    authServices,
    dbase,
    databaseServices
};
