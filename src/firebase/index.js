/**
 * A simple entry point to the firebase module.
 * Groups and exposes all functionalities from the module to other modules in one file.
 *
 * {@description IMPORTANT
 *      As this is an interface,
 *      Modules outside of {@link "/firebase"} should not need to
 *      access other files other than this to use firebase.
 * }
 * {@example usage:
 *      {@link src/components/SignOut.js}
 *      {@code import { auth } from '../firebase';}
 * }
 */
import {auth, authServices} from './firebase';
import * as dbase from './dbase';

export {
    auth,
    authServices,
    dbase
};
