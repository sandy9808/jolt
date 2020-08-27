/**
 * @typedef {Object} Template
 * @param {HTMLTemplateElement} template - The template element created.
 * @param {Array.<Function>} events - The array of events to be bound to the elements.
 */

 /**
  * Templating Engine for components.
  * @class
  * @private
  */
 export class TemplateEngine {

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
        const templateSource = strings.reduce((combined, string, i) => {
            let value = values[i];
            if (value == undefined) value = "";

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

        /* if the templateSource has a self closing or void web component, change it to a closing web component */
        template.innerHTML = templateSource.replace(/<([a-z]+-[a-z]+)([^/>]*)\/>/g, `<$1$2></$1>`);

        return { template, events };
    }

    /**
     * Processes the Template into a usable DOM Tree.
     * @param {Template} template - The template to process.
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
 }