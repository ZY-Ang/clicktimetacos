/**
 * Database API for firebase to data related operations - fetching, pushing, updating, etc.
 *
 * This is an interface between the official Firebase API and the webapp.
 */

import {auth, dbase} from './firebase';

/**
 * Calls the
 * @param _callback function
 * when the user tacos are changed or updated
 */
export const doOnUserTacoChanged = (_callback) =>
    dbase.ref(`${auth.currentUser.uid}`)
        .on('value', _callback);

/**
 * Removes all listeners attached to the current
 * user's taco
 */
export const doOffUserTacoChanges = () =>
    dbase.ref(`${auth.currentUser.uid}`)
        .off();

export const getUserTacos = () =>
    dbase.ref(`${auth.currentUser.uid}`)
        .once('value');

export const doAddTaco = (taco) =>
    dbase.ref(`${auth.currentUser.uid}`)
        .push(taco);

export const doClearTaco = (tacoId) =>
    dbase.ref(`${auth.currentUser.uid}/${tacoId}`)
        .remove();
