export default {
    //mutations唯一的目的就修改state中的状态
    //mutations中每个方法尽可能完成的事件比较单一一点
    addCounter(state, payload) {
        payload.count += 1;
    },
    addToCart(state, payload) {
        payload.checked = true
        payload.count = 1

        state.cartList.push(payload)
    }
}