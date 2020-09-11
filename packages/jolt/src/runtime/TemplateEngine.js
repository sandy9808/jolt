/**
 * @typedef {Object} Template
 * @param {string} source
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
        let events = [];

        /* piece together the template strings with the template values */
        let source = strings.reduce((combined, string, i) => {
            let value = values[i];
            if (value == undefined) value = "";

            /* if the string is an event, add an event marker and add the event to the events array */
            if (string.match(/ on.*="?$/) && typeof value == "function") {
                events.push(value);
                return combined + string + "{{e}}";
            }

            /* if the string is an attribute assignment without quotes, add quotes to the assignment */
            else if (string.match(/ .*=$/)) {
                return combined + string + `"${value}"`;
            }

            /* if the value is a Template, combine the template with this Template */
            else if (TemplateEngine.isTemplate(value)) {
                events = events.concat(value.events);
                return combined + string + value.source;
            }

            /* if the value is an array of Templates, parse them into this Template */
            else if (TemplateEngine.isTemplateArray(value)) {
                let html = "";

                for (let fragment of value) {
                    events = events.concat(fragment.events);
                    html += fragment.source;
                }

                return combined + string + html;
            }

            /* else add the string with its value to the Template */
            else {
                return combined + string + value;
            }
        }, "");

        const selfClosingRegex = /<([a-z]+-[a-z]+)([^/>]*)\/>/g;

        /* if the source has a self closing web component, change it to a closing web component */
        if (selfClosingRegex.test(source)) {
            source = source.replace(selfClosingRegex, `<$1$2></$1>`);
        }

        return { source, events };
    }

    /**
     * Processes the Template into a usable DOM Tree.
     * @param {Template} template
     * @return {DocumentFragment}
     */
    static processTemplate({ source, events }) {
        const template = document.createElement("template");
        template.innerHTML = source;


        /* if there are events to bind, walk through the template and bind the events */
        if (events.length > 0) {
            const walker = document.createTreeWalker(template.content, 1);

            let currentNode;
            let index = 0;

            while (currentNode = walker.nextNode()) {

                if (currentNode.hasAttributes()) {
                    const length = currentNode.attributes.length - 1;

                    for (let i = length; i >= 0; --i) {
                        const attribute = currentNode.attributes[i];

                        if (attribute.value == "{{e}}") {
                            currentNode.addEventListener(attribute.localName.slice(2), events[index++]);
                            currentNode.removeAttribute(attribute.localName);
                        }
                    }
                }
            }
        }

        return template.content;
    }

    /**
     * Determines if an object is a Template.
     * @param {Object} value
     * @return {boolean}
     */
    static isTemplate(value) {
        return (typeof value == "object" && value.source && value.events);
    }

    /**
     * Determines if an object is an array of Templates.
     * @param {Object} value
     * @return {boolean}
     */
    static isTemplateArray(value) {
        return (Array.isArray(value) && value[0] && value[0].source && value[0].events);
    }
}

/**
 * Creates a {@link Template} to be rendered.
 * @param {TemplateStringsArray} strings 
 * @param  {...*} values
 * @return {Template}
 */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}