You're about to create a minimal dependency injection container.

We'll use a structure inspired by the DI container in Angular.JS.

## How to use this repository?

### Structure

The repo has 3 important files:

 * **di.js** will contain your source code
 * **spec.js** contains for each step a series of specs that your code must fulfill
 * **index.html** can be opened in the browser and will display the results of the spec run

### Branches

This repository contains a number of branches:

 * step_1
 * step_2
 * ...

For each of the steps of the workshop.

## Step 0

You are currently on the master branch, you need to switch to the `step_1` branch.

```sh
git checkout step_1
```

## Step 1 (constants)

Our container will offer 3 ways to set a service to be shared. And we'll build them step by step by gradual difficulty.

 * **di.constant(name, value)** will register a constant that can be returned directly and doesn't need to be instantiated
 * **di.set(name, service_definition)** will register a service for which a new instance will be created each time we call it
 * **di.share(name, service_definition)** will register a service for which a single instance is created and then always returned

There will always be only one way to retrieve a service: **di.get(name)**.

The goal of this step is to implement the simple constant and get method, without any dependencies (to be clear, it is not possible anyway to have constants and dependencies). The specs are already defined, all you have to do is fill in the necessary code in **di.js** in order to make the tests pass.

## Step 2 (instantiable services, NO dependencies)

In this step, we'll implement **di.set()** so that a service can be instantiated. Services are still instantiated without dependencies for now.

**Note:** In languages that are not JavaScript, you would probably do things in a much different way. Eg: in Java, you would pass a fully qualified class name and instantiate an instance of the class to be a service. In JavaScript, a class and a function are the same thing. Because of this, our choice is that a service definition is always a function that will be called directly (without the **new** operator).

```js
function Dog(){};

di.set('dog', function(){return new Dog();});
di.set('url', function(){return window.location;});
```
You **might** have to modify the code that is currently in **di.js** as the solution from the previous step might not be enough for you at this step.

## Step 3 (dependencies, NO circular ones)

In this step, our services can have dependencies. The dependencies will be defined as follow:

```js
function Bean(){}
function Grinder(){}
function Water(){}

di.set('bean', function(){return new Bean();});
di.set('grinder', function(){return new Grinder();});
di.set('water', function(){return new Water();});

function makeCoffee(beans, grinder, water) {
    // ...
}
makeCoffee.inject = ['bean', 'grinder', 'water'];

di.set('coffee', makeCoffee);
di.get('coffee');
```

You are not (yet) expected to deal with circular dependencies.

## Step 4 (Dealing with circular dependencies)

If the user defines circular dependencies, right now, this will put our container in an infinite loop. For example:

```js
function A(b){}
function B(a){}

A.inject = ['b']
B.inject = ['a']

di.set('a', A);
di.set('b', B);

di.get('a');
```

This would create an infinite loop.

There is no way to resolve these dependencies correctly, but we can (and should) throw an error to let the user know that he is having a problem of circular dependencies.

Note that the following example however is not a circular dependency and should be allowed to work

```js
var di = new Di();

function A(b){}
function B(a){}
function C(a){}

A.inject = ['b', 'c']
B.inject = ['c']

di.set('a', A);
di.set('b', B);
di.set('c', C);

di.get('a');
```

At this step, we have added the lodash library for convenience. There are 2 functions you might need from that library, and here's how to use them:

```js
_.contains(['a', 'b', 'c'], 'c');  // Returns true if the array (first argument) contains the element (second argument)
_.clone(object) // Returns a copy of the object / array / function that was passed to it.
```

## Step 5 (shared services)

Because they are simpler to build, we built non-shared services first, however 99% of the time when using DI, you want to use shared services. The container should always return you the same instance of a service after the first time.

In this step you need to implement the **di.share()** function. It works exactly the same as the **di.set()** function but later when using **di.get()** you always get the same instance of your service.

