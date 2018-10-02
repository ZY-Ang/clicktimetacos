import React from 'react';
import {dbase} from "./firebase";

/**
 * Style to keep the layer groups from overflowing the page
 */
const STYLE_LAYER_GROUPS = {
    maxHeight: 200,
    overflow: 'auto',
    padding: 10
};

/**
 * Component of Checkbox group to display form items for submission
 *
 * @param layers - options (layers for the current title) that the user can select
 * @param title - of the current layer check group
 * @param checkLayer - function that returns a function that toggles the layer in the Modal's state
 * @returns {*}
 */
const LayerCheck =({layers, title, checkLayer}) => (
    <div className="col-md-4">
        <h4 className="card-title">Select {title}</h4>
        <div style={STYLE_LAYER_GROUPS}>
            {
                layers.map(layer =>
                    <div key={layer.slug} className="form-check">
                        <label className="form-check-label">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                onChange={() => checkLayer(layer.name)}
                            />
                            {layer.name}
                            <span className="form-check-sign"><span className="check"/></span>
                        </label>
                    </div>
                )
            }
        </div>
    </div>
);

/**
 * Component of Radio group to display form items for submission
 *
 * @param layers - options (layers for the current title) that the user can select
 * @param title - of the current layer check group
 * @param checkLayer - function that returns a function that toggles the layer in the Modal's state
 * @param checkedLayer - the currently checked layer
 * @returns {*}
 */
const LayerRadio = ({layers, title, checkLayer, checkedLayer}) => (
    <div className="col-md-6">
        <h4 className="card-title">Select a {title}</h4>
        <div style={STYLE_LAYER_GROUPS}>
            {
                layers.map(layer =>
                    <div key={layer.slug} className="form-check form-check-radio">
                        <label className="form-check-label">
                            <input
                                className="form-check-input"
                                type="radio"
                                name={`radio_${layer.slug}`}
                                id={`radio${layer.slug}`}
                                value={layer.name}
                                onChange={() => checkLayer(layer.name)}
                                checked={(checkedLayer === layer.name)}
                            />
                            {layer.name}
                            <span className="circle"><span className="check"/></span>
                        </label>
                    </div>
                )
            }
        </div>
    </div>
);

/**
 * @param layerGroupSelection - map of selected layer group from state
 * @returns {Array<string>} of selection to
 *      be uploaded or {null} if
 */
const toSelectionLayerArray = (layerGroupSelection) => {
    const selection = Object.keys(layerGroupSelection).filter(layer => layerGroupSelection[layer]);
    if (!selection.length) {
        return null;
    } else {
        return selection
    }
};

/**
 * Popup modal for the user to build a Taco
 */
class ModalBuildTaco extends React.Component {
    constructor() {
        super();
        this.INITIAL_STATE = {
            baseLayer: null, // Only one base
            shell: null,     // Only one shell else abomination Taco
            mixins: {},
            seasonings: {},
            condiments: {}
        };
        this.state = {
            ...this.INITIAL_STATE
        };
    }

    buildTaco = (event) => {
        if (event) {
            // Prevent default form refresh behaviour on submit
            event.preventDefault();
        }

        // Validate form data
        if (this.state.baseLayer === this.INITIAL_STATE.baseLayer) {
            return alert("Please select a base layer");
        }
        if (this.state.shell === this.INITIAL_STATE.shell) {
            return alert("Please select a shell");
        }

        // Submit the form
        dbase.doAddTaco({
            baseLayers: [this.state.baseLayer],
            shells: [this.state.shell],
            mixins: toSelectionLayerArray(this.state.mixins),
            seasonings: toSelectionLayerArray(this.state.seasonings),
            condiments: toSelectionLayerArray(this.state.condiments)
        })
            // Reset state
            .then(() => this.setState(() => this.INITIAL_STATE));
    };

    /**
     * @param layerGroup (string) - key of the layer group
     * @returns {function(*): void} - function that allows a
     * layer to be checked (radio)
     */
    createRadioLayer = (layerGroup) =>
        (layer) => this.setState(() => ({
            [layerGroup]: layer
        }));

    /**
     * @param layerGroup (string) - key of the layer group
     * @returns {function(*): void} - function that allows a
     * layer to be checked (multiple)
     */
    createMultiCheckLayer = (layerGroup) =>
        (layer) =>
            this.setState(() => ({
                [layerGroup]: {
                    ...this.state[layerGroup],
                    [layer]:!this.state[layerGroup][layer]
                }
            }));

    render() {
        const {toppings} = this.props;
        return (
            <div
                className="modal fade taco-modal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="tacoModal"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="card card-signup card-plain">
                            <div className="modal-header">
                                <div className="card-header card-header-success text-center" style={{width: '100%'}}>
                                    <h3 className="card-title">Build a Taco <span role="img" aria-label="build-taco">🌮</span></h3>
                                </div>
                            </div>
                            <div className="modal-body">
                                <form className="form" onSubmit={this.buildTaco}>
                                    <p className="description text-center">Or Be Classical</p>
                                    {
                                        toppings &&
                                        <div className="card-body">
                                            <div className="row">
                                                <LayerRadio
                                                    layers={toppings.baseLayers}
                                                    title="base"
                                                    checkLayer={this.createRadioLayer('baseLayer')}
                                                    checkedLayer={this.state.baseLayer}
                                                />
                                                <LayerRadio
                                                    layers={toppings.shells}
                                                    title="shell"
                                                    checkLayer={this.createRadioLayer('shell')}
                                                    checkedLayer={this.state.shell}
                                                />
                                                <LayerCheck
                                                    layers={toppings.mixins}
                                                    title="mixins"
                                                    checkLayer={this.createMultiCheckLayer('mixins')}
                                                />
                                                <LayerCheck
                                                    layers={toppings.condiments}
                                                    title="condiments"
                                                    checkLayer={this.createMultiCheckLayer('condiments')}
                                                />
                                                <LayerCheck
                                                    layers={toppings.seasonings}
                                                    title="seasonings"
                                                    checkLayer={this.createMultiCheckLayer('seasonings')}
                                                />
                                            </div>
                                            <div className="row text-center">
                                                <div className="col">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-lg"
                                                        data-toggle="modal"
                                                        data-target=".taco-modal"
                                                    >
                                                        <i className="fa fa-paper-plane"/> Build
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalBuildTaco;
