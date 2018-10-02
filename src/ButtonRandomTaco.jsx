import React from 'react';
import {dbase} from "./firebase";

const getRandomFromArray = (array) =>
    array[Math.floor(Math.random() * array.length)];

/**
 * Button that generates a random taco.
 * @param toppings {object} - available toppings to be added
 */
class ButtonRandomTaco extends React.Component {
    generateRandomTaco = (event) => {
        const {baseLayers, condiments, mixins, seasonings, shells} = this.props.toppings;
        dbase.doAddTaco({
            baseLayers: [getRandomFromArray(baseLayers).name],
            mixins: [getRandomFromArray(condiments).name],
            seasonings: [getRandomFromArray(mixins).name],
            condiments: [getRandomFromArray(seasonings).name],
            shells: [getRandomFromArray(shells).name]
        });
        if (event) {
            event.preventDefault();
        }
    };
    render() {
        return this.props.toppings ? (
            <button className="btn btn-primary btn-round" onClick={this.generateRandomTaco}>
                <span role="img" aria-label="random-taco">🌈</span> Random me tacos
            </button>
        ) : null;
    }
}

export default ButtonRandomTaco;
