import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

// Action types
const increment = "account/increment"

// Action creators
const incrementAmount = () => {
    return { type: increment };
}


// Reducer
const accountReducer = (store = { amount: 1 }, action) => {

    let newStore = store;
    switch (action.type) {
        case increment: newStore = { ...store, amount: store.amount + 1 }
            break
    }
    return newStore
}


const store = createStore(accountReducer, applyMiddleware(logger.default));

setTimeout(() => {
    store.dispatch(incrementAmount())
}, 2000)