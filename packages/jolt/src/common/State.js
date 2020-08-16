/**
 * State Callback
 * @callback StateCallback
 * @param {State} [state] - The state object.
 * @param {string} [key] - The state property name.
 * @param {*} [value] - The state property value.
 */

/**
 * Creates a State Object with functions for state management.
 * @class
 */
export class State {

    /**
     * Sets a new state. This method merges the previous state with the new one.
     * @param {Object} state - The new state.
     */
    set(state) {
        this.prototype = Object.assign(this, state);
    }

    /**
     * Creates a new state object and registers the handler for set events.
     * @param {StateCallback} [callback] - The callback to run when a set event happens.
     * @return {State}
     */
    static create(callback) {
        return new Proxy(new State(), {
            set: (state, key, value) => {
                /* prevent redundant state updates */
                if (key == "prototype" || state[key] == value) {
                    return true;
                }

                /* if the state property exists then it should be updated */
                if (state[key] != undefined) {
                    state[key] = value;
                    if (callback) callback(state, key, value);
                    return true;
                }

                /* if the state property does not exist and is an array, create it as a proxy */
                if (Array.isArray(value)) {
                    state[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* the state property does not exists, so it should be created */
                state[key] = value;
                return true;
            }
        });
    }

    /**
     * Creates a new array proxy, for calling the callback when an array is changed.
     * @param {Array.<*>} array - The array to be wrapped in a proxy.
     * @param {StateCallback} [callback] - The callback to run when a set event happens.
     * @return {Array.<*>}
     */
    static createArrayProxy(array, callback) {
        return new Proxy(array, {
            set: (state, key, value) => {
                /* prevent redundant state updates */
                if (key == "prototype" || state[key] == value) {
                    return true;
                }

                /* if the state property does not exist and is an array, create it as a proxy */
                if (Array.isArray(value)) {
                    state[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* the state property does not exists, so it should be created */
                state[key] = value;
                if (callback) callback(state, key, value);
                return true;
            }
        });
    }
}

State._hooks = [];
State._currentHook = 0;