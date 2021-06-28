<template>
  <div class="bottom-bar">
      <div class="check-content">
      <check-button 
            :is-checked="isSelectAll" 
            class="check-button"
            @click.native="checkClick"/>
      <span>全选</span>
      </div>

      <div class="price">
          合计：{{totalPrice}}
      </div>

      <div class="calculate" @click="aclcClick">
          去计算({{checkLength}})
      </div>
  </div>
  
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'

    import { mapGetters } from 'vuex'

    export default {
       name:"CarBottomBar",
       components: {
           CheckButton
       },
       computed: {
           ...mapGetters(['cartList']),
           totalPrice() {//计算选中商品总价格
               return '￥' + this.cartList.filter(item => {
                   return item.checked
               }).reduce((preValue, item) => {
                   return preValue + item.price * item.count
               },0).toFixed(2)
           },
           checkLength() {//选中商品个数
               return this.cartList.filter(item => item.checked).length
           },
           isSelectAll() {
               if (this.cartList.length === 0) return false
               //1.使用filter
                //return !(this.cartList.filter(item => !item.checked).length)

                //2.使用find
                // return !this.cartList.find(item => !item.checked)

                //3.普通遍历
                for (let item of this.cartList) {
                    if (!item.checked) {
                        return false
                    }
                }
                return true
           }
       },
       methods: {
           checkClick() {
               if(this.isSelectAll) {//全部选中
                    this.cartList.forEach(item => item.checked = false)
               } else {//部分或者全部不选中
                   this.cartList.forEach(item => item.checked = true)
               }
            // this.cartList.forEach(item => item.checked = !this.isSelectAll)
           },
           aclcClick() {
               if(!this.isSelectAll) {
                   this.$toast.show('请选择购买的商品', 2000)
               }
           }
       },
    }
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.check-content {
  display: flex;
  height: 100%;
  align-items: center;
}
.check-botton {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.calculate{
  padding-right: 5px;
  background-color: red;
  height: 100%;
  width: 100px;
  line-height: 40px;
  text-align: center;
  color: white;
}
</style>