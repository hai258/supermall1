export default {
    addCart(context, payload) {
        return new Promise((resolve) => {
            //payload新添加的商品
            // let oldProduct = null;
            // for (let item of state.cartList) {
            //     if (item.iid === payload.iid) {
            //         oldProduct = item;
            //     }
            // }
            //1.查找之前数组中是否有改商品
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
                //2.判断oldProduct

            //如果存在,数量加一,否则添加新商品到购物车
            if (oldProduct) { //数量+1
                // oldProduct.count += 1
                context.commit('addCounter', oldProduct)
                resolve('当前的商品数量+1')
            } else { //添加新的商品
                // state.cartList.push(payload)
                context.commit('addToCart', payload)
                resolve('添加了新的商品')
            }
        })

    }
}