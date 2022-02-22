import { createStore } from 'redux'
import userReducer from './UserReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const composeEnhancers = composeWithDevTools()
const store = createStore(userReducer, composeEnhancers)

export default store