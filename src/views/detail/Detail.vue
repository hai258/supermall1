<template>
  <div id="detail">
    <!-- 顶部导航栏 -->
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
      <!--滚动区域  -->
      <scroll class="content"
              ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll">
        <!-- 轮播图组件-->
        <detail-swiper :top-images="topImages"/>
        <!-- 商品信息组件 -->
        <detail-base-info :goods="goods"/>
        <!-- 店铺信息组件 -->
        <detail-shop-info :shop="shop"/>
        <!-- 商品详情信息组件 -->
        <detail-image-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
        <!-- 商品详情参数 -->
        <detail-param-info ref="params" :param-info="itemParams"/>
        <!-- 评论信息 -->
        <detail-comment-info ref="comment" :comment-info="commentInfo"/><br>
        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"/>

      <back-top @click.native="backClick" v-show="isShowBackTop"/>
      <!-- <toast :message="message" :show="show"/> -->
      <h2>详情页：{{iid}}</h2>
  </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailImageInfo from './childComps/DetailImageInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'


    import {getDetail, Goods, Shop, getRecommend} from "network/detail";
    import {debounce} from "common/utils";
    import {itemListenerMixin,backTopMixin} from "common/mixin";
    import { mapActions } from 'vuex'
// import Toast from '../../components/common/toast/Toast'

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailImageInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList,
                // Toast
        },
        mixins: [itemListenerMixin,backTopMixin],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                // paramInfo: {},
                commentInfo: {},
                itemParams: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY:null,
                currentIndex:0,
                // message:'',
                // show:false

            }
        },
        created() {
            //1.保存传入的iid
            this.iid = this.$route.params.iid
            //2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                // console.log(res);
                //1.获取顶部的图片轮播数据
                const data = res.result;
                this.topImages = data.itemInfo.topImages

                //2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

                //3.创建店铺信息
                this.shop = new Shop(data.shopInfo)

                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo;

                //5.取出参数的值
                this.itemParams = data.itemParams
                // this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

                // 6.取出评论信息
                if(data.rate.cRate  !== 0) {
                  this.commentInfo = data.rate.list[0]
                }
                /*
                  //1.第一次获取，值不对
                  //值不对的原因：this.$refs.params.$el压根没有渲染
                  this.themTopYs = []
                  this.themTopYs.push(0);
                  this.themTopYs.push(this.$refs.params.$el.offsetTop)
                  this.themTopYs.push(this.$refs.comment.$el.offsetTop)
                  this.themTopYs.push(this.$refs.recommend.$el.offsetTop)

                  console.log(this.themTopYs);


                this.$nextTick(() => {
                  //2.第二次获取：值不对
                  //值不对原因：图片没有计算在内
                  //根据最新的数据，对应的DOM是已经被渲染出来
                  //但是图片依然是没有加载完成（目前获取到offsetTop不包含其中图片）
                  this.themTopYs = []

                  this.themTopYs.push(0);
                  this.themTopYs.push(this.$refs.params.$el.offsetTop)
                  this.themTopYs.push(this.$refs.comment.$el.offsetTop)
                  this.themTopYs.push(this.$refs.recommend.$el.offsetTop)

                  console.log(this.themTopYs);
                })
                */
                

            })
            //3.请求推荐数据
            getRecommend().then(res => {
              this.recommends = res.data.list
            });
            // console.log();
            
            //给getThemeTopY赋值(对给this.themTopYs赋值的操作进行防抖)
             this.getThemeTopY = debounce(() => {
              this.themeTopYs = []
              //第一个,商品的高度
              this.themeTopYs.push(0);
              //第二个,参数的高度
              this.themeTopYs.push(this.$refs.params.$el.offsetTop);
              //第三个,评论的高度
              this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
              //第四个,推荐的高度
              this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
              this.themeTopYs.push(Number.MAX_VALUE)
              console.log(this.themeTopYs);
            },100)
            
        },
        mounted() {
          // console.log('123');
        },
        
        destroyed() {
          this.$bus.$off('itemImageLoad', this.itemImgListener)
        },
        methods: {
          ...mapActions(['addCart']),
          detailImageLoad() {
            // console.log('-----');
              this.refresh()

              this.getThemeTopY()

          },
            //2.点击标题,跳转到对应位置
          titleClick(index) {
            console.log(this.themeTopYs);
            this.$refs.scroll.scrollTO(0, -this.themeTopYs[index],100)
          },
          contentScroll(position) {
            // console.log(position);
            //1.获取y值
            const positoinY = -position.y
            //2.positoinY和主题中值进行对比
            //[0, 32442, 33203, 33437]
            //positoinY 在0和 32442 之间，index = 0
            //positoinY超过33437值， index = 3
            let length = this.themeTopYs.length
            for(let i = 0; i < length-1; i++) {
              // console.log(i+1);//str 3 + 1 = 31
              // if(positoinY > this.themeTopYs[i] && positoinY < this.themeTopYs[i+1]) {
              // console.log(i);
           
              if (this.currentIndex !== i && (positoinY > this.themeTopYs[i] && positoinY < this.themeTopYs[i+1] )) {
                this.currentIndex = i;
                this.$refs.nav.currentIndex = this.currentIndex
              }

              // if(this.currentIndex !== i && ((i < length - 1 && positoinY >= this.themeTopYs[i] && 
              // positoinY < this.themeTopYs[i+1]) || (i === length -1 && positoinY >= this.themeTopYs[i]))) {
              //   this.currentIndex = i;
              //   console.log(this.currentIndex);
              //   this.$refs.nav.currentIndex = this.currentIndex
              // }
              //3.是否显示回到顶部
              
              //判断BackTop是否显示
              this.isShowBackTop = (-position.y) >1000

            }
            
          },
          addToCart() {
            //1.获取购物车需要展示的信息 
            const product = {}
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.realPrice;
            product.iid = this.iid;
            //2.将商品添加到购物车(1.Promise 2.mapActions)
            // this.$store.commit('addCart',product)
            this.addCart(product).then(res => {
              // this.show =true;
              // this.message = res;
              // setTimeout(() => {
              //   this.show = false;
              //   this.message = ''
              // },1500)
              this.$toast.show(res, 2000)
              console.log(this.$toast);
            })

            // this.$store.dispatch('addCart',product).then(res => {
            //   console.log(res);
            // })

            //3.添加到购物车成果

          }
        }
      }
    
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 93px);
  }
</style>