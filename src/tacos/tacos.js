import axios from "axios";

const tacoClient = axios.create({
    baseURL: "https://tacos-ocecwkpxeq.now.sh/"
});

export const getBaseLayers = () => tacoClient.get('baseLayers/').then(({data}) => data);
export const getMixins = () => tacoClient.get('mixins/').then(({data}) => data);
export const getSeasonings = () => tacoClient.get('seasonings/').then(({data}) => data);
export const getCondiments = () => tacoClient.get('condiments/').then(({data}) => data);
export const getShells = () => tacoClient.get('shells/').then(({data}) => data);

/**
 * Returns all the possible toppings as an array.
 * @private should not be used directly
 */
const getAllToppingsArray = () => Promise.all([
    getBaseLayers(),
    getMixins(),
    getSeasonings(),
    getCondiments(),
    getShells()
]);

/**
 * Removes duplicate toppings
 * FIXME: There is a duplicate Morrocan something base layer. You should probably remove it.
 *
 * @author {@link https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript}
 */
const removeDuplicateToppings = (toppings) =>
    toppings.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.slug === thing.slug && t.name === thing.name
        ))
    );

/**
 * Returns all the possible toppings as a map.
 * @returns {
 *     baseLayers<object>,
 *     mixins<object>,
 *     seasonings<object>,
 *     condiments<object>,
 *     shells<object>
 * }
 */
export const getAllToppings = () => getAllToppingsArray()
    .then(results => {
        // Return result as an object map of arrays
        return {
            baseLayers: removeDuplicateToppings(results[0]),
            mixins: results[1],
            seasonings: results[2],
            condiments: results[3],
            shells: results[4]
        };
    });
