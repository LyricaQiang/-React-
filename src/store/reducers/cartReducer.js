import * as TYPES from '../action-types';

const initState = {
    orderList: null,
    isSelectAll: true,
    //编辑按钮的状态
    isEdite: false,
    isSelectAllEdite: false
};

export default function cartReducer(state = initState, action) {
    state = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case TYPES.CART_ORDERALL:
            state.orderList = action.payload;
            state.orderList = state.orderList.map(item => {
                //把从服务器获取的信息，自定义一个是否被选中的属性
                item.isSelect = true;
                item.isSelectEdite = false;
                return item;
            });
            break;
        case TYPES.CART_UPDATE_SELECT_ALL:
            state.isSelectAll = action.flag;
            //只选择状态为1的商品，并且让他们的isSelect与isSelectAll保持一致
            state.orderList = state.orderList.map(item => {
                if(parseInt(item.state) === 1) {
                    item.isSelect = state.isSelectAll
                }
                return item;
            });
            break;
        case TYPES.CART_UPDATE_SELECT:
            //单一选中态
            state.orderList = state.orderList.map(item => {
                if(parseInt(item.id) === parseInt(action.cartId)) {
                    item.isSelect = action.flag;
                }
                return item;
            });
            //有一个商品未被选中,全选按钮状态为false
            const result = state.orderList.find(item => (parseInt(item.state) === 1 && item.isSelect === false ));
            state.isSelectAll = result ? false : true;
            break;

        //编辑状态下的全选处理
        case TYPES.CART_UPDATE_SELECT_ALL_EDITE:
            state.isSelectAllEdite = action.flag;
            // 只选择状态为1的商品，并且让他们的isSelect与isSelectAll保持一致
            state.orderList = state.orderList.map(item => {
                if(parseInt(item.state) === 1) {
                    item.isSelectEdite = state.isSelectAllEdite
                }
                return item;
            });
            break;
        case TYPES.CART_UPDATE_SELECT_EDITE:
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.id) === parseInt(action.cartId)) {
                    item.isSelectEdite = action.flag;
                }
                return item;
            });
            //编辑下，有一个商品未被选中,全选按钮状态为false
            const result2 = state.orderList.find(item => (parseInt(item.state) === 1 && item.isSelectEdite === false));
            state.isSelectAllEdite = result2 ? false : true;
            break;
        //编辑按钮的状态
        case TYPES.CART_UPDATE_EDITE:
            state.isEdite = action.flag;
            break;
        //购物车数量状态修改
        case TYPES.CART_UPDATE_COUNT:
            state.orderList = state.orderList.map(item => {
                if(parseInt(item.id) === parseInt(action.cartId)) {
                    item.count = action.count;
                }
                return item;
            });
            break;
        //删除购物车商品数量
        case TYPES.CART_REMOVE:
            state.orderList = state.orderList.filter(item => {
                return parseInt(item.id) !== parseInt(action.cartId);
            });
            break;
    }
    return state;
}