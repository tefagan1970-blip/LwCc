# User Experience Coding Challenge

Angular application built for the Liquidware coding challenge.

The application provides a simple login flow and displays user experience data retrieved from the supplied Liquidware API. Users can change the reporting date range and drill into an individual user/machine for more detailed data.

This implementation intentionally stays close to the requirements of the coding exercise. I kept the user experience focused and avoided adding features or interactions beyond the requested workflow.

## Tech Stack

- Angular 22
- TypeScript
- Angular Material
- NgRx
- RxJS
- Vitest
- SCSS
- Zoneless change detection

The application uses Angular standalone components throughout.

## Getting Started

### Requirements

Node 24 is recommended.

The project was developed using:

    Node 24.15.0
    Angular CLI 22.x

Install dependencies:

    npm install

Start the development server:

    npm start

The application will be available at:

    http://localhost:4200

## Tests

Run the unit tests with:

    npm test

## Linting

Run ESLint with:

    npm run lint

## Formatting

Check formatting with:

    npm run format:check

Format the project with:

    npm run format

## Production Build

    npm run build

## Application Structure

Most application code is organized under `src/app`.

    core/
      guards/
      models/
      store/

    features/
      login-page/
      data-page/

    shared/
      components/
      constants/
      utils/

`core` contains application-level services, models, guards, and NgRx state.

`features` contains routed pages.

`shared` contains reusable UI components and supporting utilities.

## State Management

NgRx is used for application state.

The state is separated into a few areas:

- Authentication state
- API data
- Application state such as the selected date range

API requests are handled through NgRx effects and the API service.

Angular signals are used when consuming store selectors in components.

## Data Page

The same data page is used for both the main list and detail views.

The main route displays the user list:

    /apidata

Selecting a row navigates to a detail route containing the selected user and machine:

    /apidata/:userName/:nodeName

The presence of these route parameters determines whether the page operates in list or detail mode.

This keeps the common table, date selection, loading behavior, and API handling in one place rather than maintaining two nearly identical pages.

## Date Range

The date range selector stores the selected range in application state.

Changing the range causes the current data view to reload using the new date value.

The default range is one week.

## Loading and Errors

Loading state is managed through NgRx and displayed using an Angular Material loading dialog.

The dialog prevents interaction with the page while a request is in progress.

API errors are stored in state and displayed to the user rather than being handled only through the browser console.

## Styling

Angular Material is used for the primary UI components.

Global application styling and theme configuration are located in:

    src/styles.scss

The root font size is 14px, with application sizing primarily based on `rem` units.

## Notes

The API expects requests using `application/x-www-form-urlencoded`. The request payload is serialized as JSON and submitted through the `json` form field.

The application uses Angular's zoneless change detection and `OnPush` change detection for application components.
