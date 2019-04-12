# CS4098 Team 3: Web Application

This application is the client-side web application.

Related repositories:
* [API Server](https://github.com/inglec/tb-or-not-tb-api-server)
* [Load Balancer](https://github.com/inglec/tb-or-not-tb-load-balancer)
* [Video Server](https://github.com/inglec/tb-or-not-tb-video-server)

## Installation

Update packages:
``` bash
sudo apt update
sudo apt -y upgrade
```

Install Node.js and NPM:
``` bash
sudo apt install nodejs
```

Clone the repository:
``` bash
git clone https://github.com/inglec/tb-or-not-tb-client client
```

Install dependencies specified in `package.json`:
``` bash
npm install
```

### Chrome Extensions

Install the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension to debug the React state tree.

Install the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) extension to debug Redux store state.

## Scripts

`package.json` defines scripts which perform common tasks.

### Serving

The server is run with `webpack-dev-server`, which monitors the file tree and updates the React application when file modifications are detected. This mode should only be used for development, **not production**.

Run the server:
``` bash
npm start
```

### Linting

The repository is set up to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/blob/master/README.md).

Run linting:
``` bash
npm run lint
```

If you use Atom, the [linter-eslint](https://atom.io/packages/linter-eslint) package shows linting errors in the editor.

## Directory Structure

The application begins in `src/index.jsx`, which sets up the Redux store and renders the `<App />` component (`src/containers/App.jsx`).

### Containers vs. Presentational Components

[This article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) details the difference between containers and presentational components, but the following is a summary:
* **Presentational components** (`.jsx`) receive data via props and are concerned with how things look.
* **Container components** (`.js`) access data from the Redux store and pass it to presentational components.

If a component does not need access to application state, then you only need to make a presentational component.

If the component needs to retrieve / store state in the Redux store, you need a container (`src/containers`). This container should then pass this to the relevant presentational component via `mapStateToProps` (retrieve data) and `mapDispatchToProps` (dispatch actions e.g. store data).

#### Example

`src/components/PresentationalComponent.jsx`
``` js
import PropTypes from 'prop-types';
import React from 'react';

// Define render method of Stateless Functional Component.
const PresentationalComponent = (props) => {
  return <p>{props.stringStoredInReduxStore}</p>;
};

// Declare props.
PresentationalComponent.propTypes = {
  stringStoredInReduxStore: PropTypes.string.isRequired,
};

export default PresentationalComponent;
```

`src/containers/ContainerComponent.js`

``` js

import { connect } from 'react-redux';

import PresentationalComponent from 'src/components/PresentationalComponent';

const mapStateToProps = (state) => {
  return { stringStoredInReduxStore: state.string };
};

export default connect(mapStateToProps)(PresentationalComponent);
```

We would then render the container component, which would in turn render the presentational component.

`src/components/App.jsx`;

``` js
import React from 'react';

import ContainerComponent from 'src/containers/ContainerComponent';

const App = (props) => {
  return (
    <div>
      <h1>My App</h1>
      <ContainerComponent />
    </div>
  );
};
```
