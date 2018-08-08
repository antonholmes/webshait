import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
// import user from './user'

// const reducer = combineReducers({user})
// const middlewware = composeWithDevTools(
//   applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
// )
const store = createStore(reducer, middlewware)

export default store
// export * from './user'
