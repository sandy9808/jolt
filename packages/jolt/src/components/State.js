/**
 * State Callback
 * @callback StateCallback
 * @param {string} [key]
 * @param {*} [value]
 */

/**
 * State class for responding to changes in an object.
 * @class
 */
export class State {

    /**
     * Sets a new state. This method merges the previous state with the new one.
     * @param {Object} state 
     */
    set(state) {
        this.prototype = Object.assign(this, state);
    }

    /**
     * Creates a new state object and registers the handler for set events
     * @param {StateCallback} callback
     * @return {State}
     */
    static createState(callback) {
        return new Proxy(new State(), {
            set: (state, key, value) => {
                /* prevent redundant state updates */
                if(key == "prototype" || state[key] == value) return true;

                /* if state property exists, it should be updated. */
                if(state[key] != undefined) {
                    state[key] = value;
                    callback(key, value);
                    return true;
                }

                /* if the state property does not exist and the value is an array, create an array proxy */
                if(Array.isArray(value)) {
                    state[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* if the state property does not exist and the value is an object, create an object proxy */
                if(value.constructor == Object) {
                    state[key] = State.createObjectProxy(value, callback);
                    return true;
                }

                /* the state property does not exists, so it should be created */
                state[key] = value;
                return true;
            }
        });
    }

    /**
     * Creates a new array proxy for calling the callback when the array is changed.
     * @param {Array.<*>} array
     * @param {StateCallback} callback
     * @return {Array.<*>}
     */
    static createArrayProxy(array, callback) {
        return new Proxy(array, {
            set: (state, key, value) => {
                /* prevent redundant state updates */
                if(key == "prototype" || state[key] == value) return true;

                /* if the state property does not exist and the value is an array, create an array proxy */
                if(Array.isArray(value)) {
                    state[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* if the state property does not exist and the value is an object, create an object proxy */
                if(value.constructor == Object) {
                    state[key] = State.createObjectProxy(value, callback);
                    return true;
                }

                /* the state property does not exists, so it should be created */
                state[key] = value;
                callback(key, value);
                return true;
            }
        });
    }

    /**
     * Creates a new object proxy for calling the callback when the object is changed.
     * @param {Object} object
     * @param {StateCallback} callback
     * @return {Object}
     */
    static createObjectProxy(object, callback) {
        return new Proxy(object, {
            set: (state, key, value) => {
                /* prevent redundant state updates */
                if(key == "prototype" || state[key] == value) return true;

                /* if the state property does not exist and the value is an array, create an array proxy */
                if(Array.isArray(value)) {
                    state[key] = State.createArrayProxy(value, callback);
                    return true;
                }

                /* if the state property does not exist and the value is an object, create an object proxy */
                if(value.constructor == Object) {
                    state[key] = State.createObjectProxy(value, callback);
                    return true;
                }

                /* the state property does not exists, so it should be created */
                state[key] = value;
                return true;
            }
        });
    }
}