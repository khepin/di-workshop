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