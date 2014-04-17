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
        this.definitions[name] = {
            value: value
        };
    };

    /**
     * Retrieves a service and if necessary instantiates it with the right dependencies
     * @param  {String} name
     * @return {mixed}
     */
    this.get = function(name) {
        var antiCircular = [];
        return this._get(name, antiCircular);
    }

    this._get = function(name, antiCircular) {
        var definition = this.definitions[name];
        if (!definition) {
            return;
        }

        if (_.contains(antiCircular, name)) {
            throw new Error('Circular dependencies.');
        }
        antiCircular.push(name);

        if (definition.value) {
            return definition.value;
        }

        var dependencies = definition.dependencies;
        var arguments = [];
        if (dependencies) {
            for (var i = 0; i < dependencies.length; i++) {
                arguments.push(this._get(dependencies[i], _.clone(antiCircular)));
            }
        }

        return definition.creator.apply(undefined, arguments);
    };

    /**
     * Add a service to the container
     * @param {String} name
     * @param {function} callable The function that will create the service
     */
    this.set = function(name, callable) {
        this.definitions[name] = {
            creator: callable,
            dependencies: callable.inject
        };
    };
};