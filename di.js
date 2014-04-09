/**
 * Yet another dependency injection container
 */
function Di(){

    this.definitions = {};

    /**
     * Saves a constant in the container. The value can be anything (an
     * integer, a function, an object, null, undefined etc...)
     * @param  {String} name  The name that will be used to retrieve the service
     * or declare a dependency on that service.
     * @param  {mixed} value
     */
    this.constant = function(name, value) {
        this.definitions[name] = value;
    };

    /**
     * Retrieves a service and if necessary instantiates it with the right dependencies
     * @param  {String} name
     * @return {mixed}
     */
    this.get = function(name) {
        return this.definitions[name];
    }
};