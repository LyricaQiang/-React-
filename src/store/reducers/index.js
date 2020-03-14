import {
	combineReducers
} from 'redux';
import personalReducer from './personalReducer';
import cartReducer from './cartReducer';

const reducer = combineReducers({
	personal: personalReducer,
	cart: cartReducer,
});
export default reducer;