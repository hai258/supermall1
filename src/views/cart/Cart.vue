<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <car-bottom-bar/>
  </div>
</template>

<script>
import NavBar from '../../components/common/navbar/NavBar'

import { mapGetters } from 'vuex'
import CartList from './childComps/CartList'
import CarBottomBar from './childComps/CarBottomBar'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CarBottomBar 
    },
    computed: {
      ...mapGetters(['cartLength'])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
