/**
 * @typedef {Object} Template
 * @param {HTMLTemplateElement} template - The template element created.
 * @param {Array.<Function>} events - The array of events to be bound to the elements.
 * @private
 */

/**
 * Compiler for creating and processing templates, as well as performing a diffing algorithm.
 * @class
 * @private
 */
export class Compiler {

    /**
     * Diffs the template and its container and make any changes.
     * @param {Template} template - The template to compile.
     * @param {HTMLElement} container - The container element.
     */
    static compile(template, container) {
        const templateNode = Compiler._processTemplate(template);
        Compiler._diff(templateNode, container);
        Compiler._updateChildren(templateNode, container);
    }

    /**
     * Creates a Template to be processed.
     * @param {TemplateStringsArray} strings - Template strings to be processed.
     * @param {Array.<*>} values - Values to be processed.
     * @return {Template}
     */
    static createTemplate(strings, values) {
        const template = document.createElement("template");
        let events = [];
    
        /* piece together the strings with the values */
        template.innerHTML = strings.reduce((combined, string, i) => {
            let value = values[i];
            if(value == undefined) value = "";
    
            /* if the string is an event, add an event marker and add the event to the events array. */
            if (string.match(/ on.*="?$/) && typeof value == "function") {
                events.push(value);
                return combined + string + "{{e}}";
            }
            /* if the string is an attribute assignment without quotes, add quotes to the assignment. */
            else if (string.match(/ .*=$/)) {
                return combined + string + `"${value}"`;
            }
            /* if the value is a Template, combine the template with this template. */
            else if (typeof value == "object" && value.template) {
                events = events.concat(value.events);
                return combined + string + value.template.innerHTML;
            }
            /* if the value is an array of templates parse them into the template */
            else if (Array.isArray(value) && value[0] && value[0].template) {
    
                let html = "";
    
                for (let fragment of value) {
                    events = events.concat(fragment.events);
                    html += fragment.template.innerHTML;
                }
    
                return combined + string + html;
            }
            /* else add the string with its value to the template. */ 
            else {
                return combined + string + value;
            }
    
        }, "");
    
        return { template, events };
    }

    /**
     * Wraps a Function Component into a WebComponent.
     * @param {Function} component - The Function Component to wrap.
     * @returns {CustomElementConstructor}
     */
    static wrap(component) {
        return class extends HTMLElement {

            constructor() {
                super();

                this.attribs = {};

                for(let attrib of this.attributes) {
                    this.attribs[attrib.localName] = attrib.value;
                }
            }

            connectedCallback() {
                Compiler.compile(component(this.attribs), this);
                if(component.didLoad) component.didLoad();
            }

            disconnectedCallback() {
                if(component.willUnload) component.willUnload();
            }
        }
    }

    /**
     * Processes the Template into a usable DOM Tree.
     * @param {Template} template - The template to process.
     * @return {DocumentFragment}
     */
    static _processTemplate({ template, events }) {
        const walker = document.createTreeWalker(template.content, 1);
    
        let currentNode = walker.nextNode();
        let index = 0;
    
        while(currentNode) {
    
            if(currentNode.attributes) {
                for(let i=0; i < currentNode.attributes.length; i++) {
                    const event = events[index];
                    const attribute = currentNode.attributes[i];

                    if(attribute.value.match(/{{e}}/)) {
                        currentNode.addEventListener(attribute.localName.slice(2), event);
                        currentNode.removeAttribute(attribute.localName);
                        index++;
                        i--;
                    }
                }
            }
    
            currentNode = walker.nextNode();
        }

        return template.content;
    }

    /**
     * Walks through the dom tree of two nodes and updates the differences.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     * @return {Node}
     */
    static _walk(newNode, oldNode) {
        if (!oldNode) return newNode;
        else if (!newNode) return null;
        else if (newNode.tagName != oldNode.tagName) return newNode;
        else {
            Compiler._diff(newNode, oldNode);
            Compiler._updateChildren(newNode, oldNode);
            return oldNode;
        }
    }

    /**
     * Calculate the differences between the DOM nodes and apply changes.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static _diff(newNode, oldNode) {
        if (newNode.nodeType == 1) Compiler._updateAttributes(newNode, oldNode);
        else if (newNode.nodeType == 3 || newNode.nodeType == 8) {
            if (oldNode.nodeValue != newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
        }

        if (newNode.nodeName == "INPUT") Compiler._updateInput(newNode, oldNode);
        if (newNode.nodeName == "OPTION") Compiler._updateAttribute(newNode, oldNode, "selected");
        if (newNode.nodeName == "TEXTAREA") Compiler._updateTextArea(newNode, oldNode);
    }

    /**
     * Updates a node's children.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static _updateChildren(newNode, oldNode) {
        let offset = 0;

        for (let i = 0; ; i++) {
            const oldChild = oldNode.childNodes[i];
            const newChild = newNode.childNodes[i - offset];

            if (!oldChild && !newChild) break;

            else if (!newChild) {
                oldNode.removeChild(oldChild);
                i--;
            }

            else if (!oldChild) {
                oldNode.appendChild(newChild);
                offset++;
            }

            else if (Compiler._isSameNode(newChild, oldChild)) {
                const morphed = Compiler._walk(newChild, oldChild);

                if (morphed != oldChild) {
                    oldNode.replaceChild(morphed, oldChild);
                    offset++;
                }
            }

            else {
                let oldMatch = null;

                const length = oldNode.childNodes.length;
                for (let j = i; j < length; j++) {
                    if (Compiler._isSameNode(oldNode.childNodes[j], newChild)) {
                        oldMatch = oldNode.childNodes[j];
                        break;
                    }
                }

                if (oldMatch) {
                    const morphed = Compiler._walk(newChild, oldMatch);
                    
                    if (morphed != oldMatch) offset++;
                    oldNode.insertBefore(morphed, oldChild);

                } else if (!newChild.id && !oldChild.id) {
                    const morphed = Compiler._walk(newChild, oldChild);

                    if (morphed != oldChild) {
                        oldNode.replaceChild(morphed, oldChild);
                        offset++;
                    }
                } else {
                    oldNode.insertBefore(newChild, oldChild);
                    offset++;
                }
            }
        }
    }

    /**
     * Update the attributes of a node.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static _updateAttributes(newNode, oldNode) {
        const oldAttributes = oldNode.attributes;
        const newAttributes = newNode.attributes;

        let length = newAttributes.length - 1;
        for (let i = length; i >= 0; --i) {
            const attribute = newAttributes[i];

            if (attribute.namespaceURI) {
                if (oldNode.getAttributeNS(attribute.namespaceURI, attribute.localName) != attribute.value) {
                    oldNode.setAttributeNS(attribute.namespaceURI, attribute.localName, attribute.value);
                }
            } else {
                if (!oldNode.hasAttribute(attribute.localName)) {
                    oldNode.setAttribute(attribute.localName, attribute.value);
                } else {
                    if (oldNode.getAttribute(attribute.localName) != attribute.value) {
                        if (attribute.value == "null" || attribute.value == "undefined") {
                            oldNode.removeAttribute(attribute.localName);
                        } else {
                            oldNode.setAttribute(attribute.localName, attribute.value);
                        }
                    }
                }
            }
        }

        length = oldAttributes.length - 1;
        for(let i = length; i >= 0; --i) {
            const attribute = oldAttributes[i];

            if(attribute.specified) {
                if(attribute.namespaceURI) {
                    if(!newNode.hasAttributeNS(attribute.namespaceURI, attribute.localName)) {
                        oldNode.removeAttributeNS(attribute.namespaceURI, attribute.localName);
                    }
                } else {
                    if(!newNode.hasAttributeNS(null, attribute.localName)) {
                        oldNode.removeAttribute(attribute.localName);
                    }
                }
            }
        }
    }

    /**
     * Updates an individual node attribute.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     * @param {string} name - The attribute name.
     */
    static _updateAttribute(newNode, oldNode, name) {
        if (newNode[name] != oldNode[name]) {
            oldNode[name] = newNode[name];
            if (newNode[name]) {
                oldNode.setAttribute(name, "");
            } else {
                oldNode.removeAttribute(name);
            }
        }
    }

    /**
     * Updates an input node's attributes.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static _updateInput(newNode, oldNode) {
        Compiler._updateAttribute(newNode, oldNode, "checked");
        Compiler._updateAttribute(newNode, oldNode, "disabled");

        if (newNode.indeterminate != oldNode.indeterminate) {
            oldNode.indeterminate = newNode.indeterminate;
        }

        if(oldNode.type == "file") return;

        if (newNode.value != oldNode.value) {
            oldNode.setAttribute("value", newNode.value);
            oldNode.value = newNode.value;
        }

        if (newNode.value == "null") {
            oldNode.value = "";
            oldNode.removeAttribute("value");
        }

        if (!newNode.hasAttributeNS(null, "value")) {
            oldNode.removeAttribute("value");
        } else if (oldNode.type == "range") {
            oldNode.value = newNode.value;
        }
    }

    /**
     * Updates an textarea node's attributes.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static _updateTextArea(newNode, oldNode) {
        if (newNode.value != oldNode.value) {
            oldNode.value = newNode.value;
        }

        if (oldNode.firstChild && oldNode.firstChild.nodeValue != newNode.value) {
            oldNode.firstChild.nodeValue = newNode.value;
        }
    }

    /**
     * Checks if two nodes are the same or not.
     * @param {Node} a - The first node.
     * @param {Node} b - The second node.
     * @return {boolean}
     */
    static _isSameNode(a, b) {
        if (a.id) return a.id == b.id;
        if (a.tagName != b.tagName) return false;
        if (a.type == 3) return a.nodeValue == b.nodeValue;
        return false;
    }
}