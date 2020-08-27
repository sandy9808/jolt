/* imports */
import { TemplateEngine } from "./TemplateEngine";

/**
 * Reconciler for updating the DOM
 * @class
 * @private
 */
export class Reconciler {

    /**
     * Reconcils the template and its container and make any changes.
     * @param {Template} template - The template to compile.
     * @param {HTMLElement} container - The container element.
     */
    static reconcil(template, container) {
        const templateNode = TemplateEngine.processTemplate(template);
        Reconciler.diff(templateNode, container);
        Reconciler.updateChildren(templateNode, container);
    }

    /**
     * Walks through the dom tree of two nodes and updates the differences.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     * @return {Node}
     */
    static walk(newNode, oldNode) {
        if (!oldNode) return newNode;
        else if (!newNode) return null;
        else if (newNode.tagName != oldNode.tagName) return newNode;
        else {
            Reconciler.diff(newNode, oldNode);
            Reconciler.updateChildren(newNode, oldNode);
            return oldNode;
        }
    }

    /**
     * Calculate the differences between the DOM nodes and apply changes.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static diff(newNode, oldNode) {
        if (newNode.nodeType == 1) Reconciler.updateAttributes(newNode, oldNode);
        else if (newNode.nodeType == 3 || newNode.nodeType == 8) {
            if (oldNode.nodeValue != newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
        }

        if (newNode.nodeName == "INPUT") Reconciler.updateInput(newNode, oldNode);
        if (newNode.nodeName == "OPTION") Reconciler.updateAttribute(newNode, oldNode, "selected");
        if (newNode.nodeName == "TEXTAREA") Reconciler.updateTextArea(newNode, oldNode);
    }

    /**
     * Updates a node's children.
     * @param {Node} newNode - The new DOM node.
     * @param {Node} oldNode - The old DOM node.
     */
    static updateChildren(newNode, oldNode) {
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

            else if (Reconciler.isSameNode(newChild, oldChild)) {
                const morphed = Reconciler.walk(newChild, oldChild);

                if (morphed != oldChild) {
                    oldNode.replaceChild(morphed, oldChild);
                    offset++;
                }
            }

            else {
                let oldMatch = null;

                const length = oldNode.childNodes.length;
                for (let j = i; j < length; j++) {
                    if (Reconciler.isSameNode(oldNode.childNodes[j], newChild)) {
                        oldMatch = oldNode.childNodes[j];
                        break;
                    }
                }

                if (oldMatch) {
                    const morphed = Reconciler.walk(newChild, oldMatch);

                    if (morphed != oldMatch) offset++;
                    oldNode.insertBefore(morphed, oldChild);

                } else if (!newChild.id && !oldChild.id) {
                    const morphed = Reconciler.walk(newChild, oldChild);

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
    static updateAttributes(newNode, oldNode) {
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
        for (let i = length; i >= 0; --i) {
            const attribute = oldAttributes[i];

            if (attribute.specified) {
                if (attribute.namespaceURI) {
                    if (!newNode.hasAttributeNS(attribute.namespaceURI, attribute.localName)) {
                        oldNode.removeAttributeNS(attribute.namespaceURI, attribute.localName);
                    }
                } else {
                    if (!newNode.hasAttributeNS(null, attribute.localName)) {
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
    static updateAttribute(newNode, oldNode, name) {
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
    static updateInput(newNode, oldNode) {
        Reconciler.updateAttribute(newNode, oldNode, "checked");
        Reconciler.updateAttribute(newNode, oldNode, "disabled");

        if (newNode.indeterminate != oldNode.indeterminate) {
            oldNode.indeterminate = newNode.indeterminate;
        }

        if (oldNode.type == "file") return;

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
    static updateTextArea(newNode, oldNode) {
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
    static isSameNode(a, b) {
        if (a.id) return a.id == b.id;
        if (a.tagName != b.tagName) return false;
        if (a.type == 3) return a.nodeValue == b.nodeValue;
        return false;
    }
}