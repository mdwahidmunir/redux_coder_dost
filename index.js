import axios from "axios";
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import { thunk } from "redux-thunk";

// Action types
const increment = "account/increment"
const init = "init"
const getAccUserPending = "account/getAccUserPending"
const getAccUserFulfiled = "account/getAccUserFulfiled"
const getAccUserRejected = "account/getAccUserRejected"
const incBonus = "bonus/incrementBonus"


// Action creators
const incrementAmount = () => {
    return { type: increment };
}
const getAccountUserPending = () => {
    return { type: getAccUserPending }
}
const getAccountUserFulfiled = (value) => {
    return { type: getAccUserFulfiled, payload: value }
}
const getAccountUserRejected = (error) => {
    return { type: getAccUserRejected, error: error }
}
const increaseBonus = () => {
    return { type: incBonus }
}


// Middleware Async functions

// Its an async function and dispatch expects async func def as param for thunk
const initUser = async (dispatch, getState) => {
    const { data } = await axios.get("http://localhost:3000/accounts/1")
    dispatch({ type: init, payload: data.amount })
}

// Wrapper function
// Its return type is also a async function and it will give async function def after its called
const getUserAccount = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getAccountUserPending())
            const { data } = await axios.get(`http://localhost:3000/accounts/${id}`)
            dispatch(getAccountUserFulfiled(data.amount))
        } catch (error) {
            dispatch(getAccountUserRejected(error))
        }
    }
}


// Reducer
const accountReducer = (store = { amount: 1 }, action) => {
    let newStore = store;
    switch (action.type) {
        case increment: newStore = { ...store, amount: store.amount + 1 }
            break
        case init: newStore = { ...store, amount: store.amount + action.payload }
            break
        case getAccUserPending: newStore = { ...store, pending: true }
            break
        case getAccUserFulfiled: newStore = { amount: action.payload, pending: false }
            break
        case getAccUserRejected: newStore = { ...store, error: action.error, pending: false }
            break
    }
    return newStore
}

const bonusReducer = (store = { points: 0 }, action) => {
    let newStore = store
    switch (action.type) {
        case incBonus: newStore = { points: store.points + 1 }
            break
    }
    return newStore
}

const store = createStore(
    combineReducers({
        account: accountReducer,
        bonus: bonusReducer
    })
    , applyMiddleware(logger.default, thunk));

setTimeout(() => {
    store.dispatch(incrementAmount())
    // store.dispatch(initUser)
    store.dispatch(getUserAccount(2))
    store.dispatch(increaseBonus())
}, 2000)