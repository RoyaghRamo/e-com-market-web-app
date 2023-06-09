# EComMarketWebApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.6.

## Project Description

This is an E-Commerce Market Application. 
The goal is to have a login/register, products & cart.
For this purpose, I'll be implementing in this WebApp the following:
- Authentication Pages
- Products Scrolling & Adding to Cart
- Categories List
- Cart Management

## Running on Docker

To run the web-app on docker, make sure that the API is running first and then use this command to run the web-app.

```bash
# Starting the Web App
$ docker-compose -p "e-com-market-app" up -d

# Stopping the Web App
$ docker-compose -p "e-com-market-app" down
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
