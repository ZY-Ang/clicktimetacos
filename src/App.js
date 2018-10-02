import React, { Component } from 'react';
import ModalBuildTaco from './ModalBuildTaco';
import tacoLoader from './taco.png';
import './App.css';
import {auth, authServices, dbase} from "./firebase";
import {getAllToppings} from "./tacos/tacos";
import ButtonRandomTaco from "./ButtonRandomTaco";

class App extends Component {
    constructor() {
        super();
        this.state = {
            signedInUser: null, // The signed in user
            tacos: null, // The user's tacos
            toppings: null, // Toppings available to the user
        };
    }

    /**
     * Generic handler for all errors caught for this app
     * @param error
     */
    handleErrors = (error) => {
        console.error(error);
    };

    componentWillMount() {
        // Firebase {@code onAuthStateChanged} returns an unsubscriber to prevent memory leaks
        this.unsubscribeAuthState = auth.onAuthStateChanged(signedInUser => {
            // Set the response of the auth state as a React state variable
            this.setState(() => ({signedInUser}));

            if (!signedInUser) {
                // User is not signed in - do sign in
                this.doSignIn();
            } else {
                // User is signed in - listen to changes from the database and sync them into local state
                dbase.doOnUserTacoChanged(tacosSnapshot => {
                    // Convert map to array for ReactJS
                    const tacosSnapshotVal = tacosSnapshot.val();
                    let tacos = null;
                    if (tacosSnapshotVal) {
                        tacos = [];
                        Object.keys(tacosSnapshotVal).forEach(key =>
                            tacos.push({
                                ...tacosSnapshotVal[key],
                                id: key
                            })
                        );
                    }
                    this.setState(() => ({tacos}));
                });
                // Load the toppings
                getAllToppings()
                    .then(toppings => this.setState(() => ({toppings})));

                if (window.FS) {
                    window.FS.identify(signedInUser.uid, {
                        displayName: signedInUser.displayName,
                        email: signedInUser.email,
                        photoURL: signedInUser.photoURL
                    });
                }
            }
        })
    }

    /**
     * Signs the user in using google
     * @see {@link https://firebase.google.com/docs/auth/web/google-signin}
     */
    doSignIn = () => {
        let googleProvider = new authServices.GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        auth.signInWithRedirect(googleProvider)
            .catch(this.handleErrors);
    };

    componentWillUnmount() {
        if (this.unsubscribeAuthState) {
            // Prevent memory leaks
            this.unsubscribeAuthState();
        }
        // Unsubscribe. Shouldn't matter in a single component app but let's just throw it in there
        dbase.doOffUserTacoChanges();
    }

    /**
     * @returns {Function} to eat a taco
     */
    eatTaco = (tacoId) => (event) =>
        dbase.doClearTaco(tacoId);

    render() {
        return this.state.signedInUser ? (
            <div
                className="page-header header-filter"
                style={{
                    backgroundColor: 'purple',
                    height: '100%',
                    minHeight: '100vh'
                }}
            >
                <ModalBuildTaco toppings={this.state.toppings}/>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-md-10 ml-auto mr-auto">
                            <div className="card">
                                <div className="card-header card-header-icon card-header-warning">
                                    <div className="card-text">
                                        <h4 className="card-title">
                                            <span role="img" aria-label="welcome">🌮</span> Welcome, {this.state.signedInUser.email}
                                        </h4>
                                        <p className="category"><a href="https://zy-ang.com" rel="noopener noreferrer" target="_blank">View my Online Resume</a></p>
                                    </div>
                                </div>
                                {
                                    this.state.tacos
                                        ? (
                                            <div className="card-body">
                                                <h4 className="card-title">Here are your Tacos:</h4>
                                                {
                                                    // TODO: Refactor into smaller component
                                                    this.state.tacos.map((taco, index) =>
                                                        <div key={taco.id}>
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <h5 className="card-title">Taco #{index + 1}</h5>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <TacoLayer title="Base" layers={taco.baseLayers}/>
                                                                            <TacoLayer title="Shell" layers={taco.shells}/>
                                                                            {!!taco.mixins && <TacoLayer title="Mixins" layers={taco.mixins}/>}
                                                                            {!!taco.seasonings && <TacoLayer title="Seasonings" layers={taco.seasonings}/>}
                                                                            {!!taco.condiments && <TacoLayer title="Condiments" layers={taco.condiments}/>}
                                                                        </div>
                                                                        <div className="col text-center">
                                                                            <button
                                                                                className="btn btn-danger btn-round"
                                                                                onClick={this.eatTaco(taco.id)}
                                                                            >
                                                                                <span role="img" aria-label="eat-taco">😋</span> Eat Taco
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="row text-center">
                                                    <div className="col">
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-success btn-round"
                                                                type="button"
                                                                data-toggle="modal"
                                                                data-target=".taco-modal"
                                                            >
                                                                <span role="img" aria-label="build-taco">🔧</span> Build a taco
                                                            </button>
                                                            <ButtonRandomTaco toppings={this.state.toppings}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="card-body text-center">
                                                <h4 className="card-title">
                                                    You've got no tacos! <span role="img" aria-label="no-taco">😢</span>
                                                </h4>
                                                <button
                                                    className="btn btn-success btn-round"
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target=".taco-modal"
                                                >
                                                    <span role="img" aria-label="build-taco">🔧</span> Build a taco
                                                </button>
                                                <p className="description text-center">or</p>
                                                <ButtonRandomTaco toppings={this.state.toppings}/>
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="page-header header-filter text-center"
                style={{backgroundColor: 'purple'}}
            >
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img className="taco-loading" src={tacoLoader} alt="Loading..."/>
                            <p className="text-white">Signing you in...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Base layer(s) component for a taco
 * @param layers - array of things to be printed out
 * @param title - title of the taco layer
 */
const TacoLayer = ({layers, title}) => (
    <div>
        <b>{title}: </b>
        {
            layers.length > 1
                ? (
                    layers.map((layer, index) =>
                        <span key={index}>
                            <span className="badge badge-pill badge-default">{layer}</span>
                            {index < layers.length - 2 ? ', ' : ''}
                            {(index >= layers.length - 2 && index < layers.length - 1) ? ' and ' : ''}
                        </span>
                    )
                ) : <span className="badge badge-pill badge-default">{layers[0]}</span>
        }
    </div>
);

export default App;
