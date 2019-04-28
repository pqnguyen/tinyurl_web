import {compose, createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'src/redux/rootReducer'

const loggerMiddleware = createLogger();

let composeEnhancer = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify here name, actionsBlacklist, actionsCreators and other options
    }) : compose;


const store = createStore(
    rootReducer,
    undefined,
    composeEnhancer(
        applyMiddleware(thunkMiddleware),
        applyMiddleware(loggerMiddleware),
    )
);


export default store;
