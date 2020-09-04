/**
 * @typedef {Object} Template
 * @param {HTMLTemplateElement} template
 * @param {Array.<Function>} events
 */

/**
 * Templating Engine for components.
 * @class
 * @private
 */
export class TemplateEngine {

    /**
     * Creates a Template to be processed.
     * @param {TemplateStringsArray} strings
     * @param {Array.<*>} values
     * @return {Template}
     */
    static createTemplate(strings, values) {
        const template = document.createElement("template");
        let events = [];

        /* piece together the template strings with the template values */
        const source = strings.reduce((combined, string, i) => {
            let value = values[i];
            if (value == undefined) value = "";

            /* if the string is an event, add an event marker and add the event to the events array */
            if (string.match(/ on.*="?$/) && typeof value == "function") {
                events.push(value);
                return combined + string + "{{e}}";
            }

            /* if the string is an attribute assignment without quoates, add quotes to the assignment */
            else if (string.match(/ .*=$/)) {
                return combined + string + `"${value}"`;
            }

            /* if the value is a Template, combine the template with this Template */
            else if (TemplateEngine.isTemplate(value)) {
                events = events.concat(value.events);
                return combined + string + value.template.innerHTML;
            }

            /* if the value is an array of Templates, parse them into this Template */
            else if (TemplateEngine.isTemplateArray(value)) {
                let html = "";

                for (let fragment of value) {
                    events = events.concat(fragment.events);
                    html += fragment.template.innerHTML;
                }

                return combined + string + html;

            }

            /* else add the string with its value to the Template */
            else {
                return combined + string + value;
            }
        }, "");

        /* if the source has a self closing web component, change it to a closing web component */
        if (source.match(/<([a-z]+-[a-z]+)([^/>]*)\/>/g)) {
            source = source.replace(/<([a-z]+-[a-z]+)([^/>]*)\/>/g, `<$1$2></$1>`);
        }

        template.innerHTML = source;

        return { template, events };
    }

    /**
     * Processes the Template into a usable DOM Tree.
     * @param {Template} template
     * @return {DocumentFragment}
     */
    static processTemplate({ template, events }) {
        const walker = document.createTreeWalker(template.content, 1);

        let currentNode = walker.nextNode();
        let index = 0;

        while (currentNode) {
            if (currentNode.attributes) {
                for (let i = 0; i < currentNode.attributes.length; i++) {
                    const event = events[index];
                    const attribute = currentNode.attributes[i];

                    if (attribute.value.match(/{{e}}/)) {
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
     * Determines if an object is a Template.
     * @param {Object} value
     * @return {boolean}
     */
    static isTemplate(value) {
        return (typeof value == "object" && value.template && value.events);
    }

    /**
     * Determines if an object is an array of Templates.
     * @param {Object} value
     * @return {boolean}
     */
    static isTemplateArray(value) {
        return (Array.isArray(value) && value[0] && value.template && value.events);
    }
}