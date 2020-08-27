<template>
  <div id="app">
    <div class="coachInfo" v-show="coachInfo.name">
      <div class="coach_info_new fs_14">
        <div class="left_20">
          <div class="name fs_24">{{coachInfo.name}}</div>
          <div class="mt_10">
            <p>{{coachInfo.city}}</p>
            <p v-html="coachInfo.introduce||'暂无简介'"></p>
          </div>
          <div class="certs mt_15" v-if="coachInfo.Certs&&coachInfo.Certs.length>0">
            <div class="cert_title">
              <span class="cert_title_sub fs_14 fw_b">职业资格</span>
              <span class="fl_r fs_12 pr_20 ff_sf"  v-show="coachInfo.plus==1">􀇻验证通过</span>
            </div>
            <div
              class="cert_detail mt_5 fs_14"
              v-for="(item,index ) in coachInfo.Certs"
              :key="index"
            >{{item.certname}}</div>
          </div>
        </div>
        <div class="swiper_con_new mt_10" >
          <div
            class="img_con swiper_con"
            v-for="(item,index ) of coachInfo.Appearances"
            :key="index"
          >
            <img
              @click="showPic(item.appearance)"
              :src="item.appearance+'?imageMogr2/thumbnail/!300x300r'"
              alt
            />
          </div>
        </div>
        <div class="count left_20 mt_10">
          <div class="class_count" >
            <p class="fs_24 fw_b">{{coachInfo.totalhours}}</p>
            <p>已完成课时</p>
          </div>
          <div class="ml_30 class_count" v-if="coachInfo.price">
            <p class="fs_24 fw_b">¥{{coachInfo.price}}</p>
            <p>课时单价</p>
          </div>
        </div>
        <div class="gap"></div>
        <div class="book_btn" @click="goSign">免费预约一对一咨询</div>
        <div class="book_modal" @click="showBookModal=false" v-if="showBookModal">
          <div class="book_box" @click.stop>
            <div class="active-box"></div>
            <div class="step1" v-if="step1">
              <h1 class="fs_24">一对一咨询</h1>
              <p>请留下你的电话号码，教练会在24小时内解答你的运动问题。</p>
              <p>号码仅供本次咨询使用，不会被透露给教练以外的任何第三方。</p>
              <!-- <input type="tel"> -->
              <mt-field class="phone_input ff_sf" type="tel" ref="phone_input" v-model="phone"></mt-field>

              <div class="step1_btn" @click="getCode">{{count==60?"下一步":count+"s"}}</div>
            </div>
            <div class="step1 step2" v-if="step2">
              <h1 class="fs_18">已经发送短信给{{checkedPhone}}</h1>
              <p>请输入短信中的验证码</p>
              <!-- <input type="tel"> -->
              <mt-field class="phone_input ff_sf" type="tel" ref="phone_input" v-model="vcode"></mt-field>
              <div @click="backToStep1" class="mt_10">没有收到/号码有误?</div>
            </div>
            <div class="step1 step3" v-if="step3">
              <h1 class="fs_18">预约成功</h1>
              <p>教练会在24小时内与你联系，请保持电话畅通。</p>
              <div class="avatar_con">
                <img class="avatar" :src="coachInfo.avatar" /> x
                <img class="logo" src="@/assets/logo2.png" alt />
              </div>
              <div class="bottom_con">
                <p>如有问题，请关注老虎运动公众号获取帮助。</p>
                <img class="wechat mt_10" src="@/assets/wechat.jpeg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="expire ta_c" v-show="isExpire">
      <img class="mt_100" src="@/assets/success/expire.png" alt />
      <p class="mt_30">很抱歉，未能找到该教练的资料</p>
      <div class="bottom">
        <img class="code" src="@/assets/wechat.jpeg" alt />
        <p class="mt_15">关注⽼⻁运动公众号，更新教练信息</p>
      </div>
    </div>
  
    <div class="top-title" @click="goApp">老虎教练app 正在助力22万位优质健身教练</div>
    <!-- <mt-popup
      v-model="popupVisible"
      :closeOnClickModal="true"
      popup-transition="popup-fade"
      :modal="true"
    >
      <img :src="popUpImg" class="popUpImg" alt />
    </mt-popup> -->
  </div>
</template>

<script>
import utils from "./servers/utils.js";
import logo from "./assets/LOGO1@2x.png";

export default {
  name: "app",
  components: {
    // sign
  },
  data() {
    return {
      phoneNumber: "",
      step1: false,
      step2: false,
      step3: false,
      showBookModal: false,
      popUpImg: "",
      popupVisible: false,

      // new
      cid: "",
      code: "",
      longEnough: false,
      isShowIntro: false,
      coachInfo: {
        // name:"洒的飞洒是但是但是是的但是但是是的是的但是   ",
        // introduce:"士大夫是的第达是的发的夫的飞洒是的伤大发而化工二狗儿沙发s二等分士大夫士大夫萨芬的士大夫 士大夫士大夫",
        Appearances: [],
      },
      config: {
        appId: "",
      },
      isExpire: false,
      isSigned: false,
      loading: false,
      phone: "",
      vcode: "",
      base64code: "",
      count: 60,
      msg_id: "",
      checkedPhone: "",
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(document.getElementById("text").offsetHeight);
    //   let height = document.getElementById("text").offsetHeight;
    //   if (height - 30 > 32) {
    //     this.longEnough = true;
    //   }
    // });
  },
  created() {
    var cid = utils.getQueryString("state");
    var code = utils.getQueryString("code");
    this.code = code;
    // if (!this.code) {
    //   this.$toast({
    //     message: "未能获取你的用户信息，请重新打开尝试。",
    //     duration: 5000
    //   });
    // }
    this.initConfig();
    this.base64code = btoa("0d3f69db66c7f0140c46a6d4:def15da9fc5c53c5119627e4");
    if (!cid) {
      this.isExpire = true;
    } else {
      this.cid = cid;
      this.getData();
    }
  },
  watch: {
    vcode(val) {
      if (val && val.length == 6) {
        console.log("dsdsdsdsd");
        // this.checkCode();
      }
    },
  },
  methods: {
    backToStep1() {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    },
    goSign() {
      this.showBookModal = true;
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      // this.$refs.phone_input.focus();
      this.$nextTick(() => {
        // this.$refs.phone_input.focus();
        document.getElementsByClassName("mint-field-core")[0].focus();
      });
    },
    // new
    showPic(img) {
      let list = this.coachInfo.Appearances.map((item) => {
        return item.appearance;
      });
      console.log(list);
      wx.previewImage({
        current: img,
        urls: list,
      });
    },
    goApp() {
      window.location.href =
        "https://tigercoach.cn/";
    },
    checkLogin() {
      if (this.code) {
        this.showSign = true;
      } else {
        let rdr = encodeURIComponent(
          "https://promo.tigercoach.cn/coach/index.html"
        );

        let url =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          this.config.appId +
          "&redirect_uri=" +
          rdr +
          "&response_type=code&scope=snsapi_base&state=" +
          this.cid +
          "&connect_redirect=1#wechat_redirect";
        window.location.href = url;
      }
    },
    initConfig() {
      // var _this = this;
      this.$api.post(
        "https://api.tigercoach.cn/v3.5/port/wx/js/signature",
        {
          // url: window.location.href
          url:
            "https://promo.tigercoach.cn/coach/index.html?state=1NEbUPXJQFONmj7L3rOQSOvNuTr",
        },
        (response) => {
          if (response.status >= 200 && response.status < 300) {
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              this.config = res.Data;
              this.initWx(res.Data);
            }
          }
        },
        {
          token: "admin_123",
        }
      );
    },
    initWx(data) {
      console.log(data);
      var _this = this;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "previewImage",
        ], // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
      });
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: _this.coachInfo.name + " 在老虎教练等你", // 分享标题
          desc: "", // 分享描述
          link:
            "https://promo.tigercoach.cn/coach/index.html?state=" + _this.cid, // 分享链接
          imgUrl: _this.coachInfo.Appearances[0].appearance || logo, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          },
        });
        wx.onMenuShareAppMessage({
          title: _this.coachInfo.name + " 在老虎教练等你", // 分享标题
          desc: "", // 分享描述
          link:
            "https://promo.tigercoach.cn/coach/index.html?state=" + _this.cid, // 分享链接
          imgUrl: _this.coachInfo.Appearances[0].appearance || logo, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          },
        });
        wx.onMenuShareQQ({
          title: "", // 分享标题
          desc: "", // 分享描述
          link: "", // 分享链接
          imgUrl: "", // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          },
        });
        wx.onMenuShareQZone({
          title: "", // 分享标题
          desc: "", // 分享描述
          link: "", // 分享链接
          imgUrl: "", // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          },
        });
      });
    },
    booking() {
      // var _this = this;
      if (this.loading) {
        return;
      }

      this.$indicator.open({
        text: "发送中...",
        spinnerType: "fading-circle",
      });
      this.loading = true;
      this.$api.post(
        "https://api.tigercoach.cn/open/reference/coach/customer",
        {
          coach_id: this.cid,
          customer_tel: this.phone,
          customer_code: this.code,
        },
        (response) => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            // this.showSuccess=true;
            if (res.Code == 200) {
              // console.log(res.Data);
              // this.coachInfo = res.Data;
              // res.code;
              // this.$toast();
              this.step1 = false;
              this.step2 = false;
              this.step3 = true;
            } else if (res.Code == 500) {
              this.$toast("登陆已过期请重试!");
              this.code = "";
              this.showSign = false;
            } else {
              // this.isExpire = true;
              this.$toast(res.Msg);
            }
          } else {
            this.$indicator.close();
            console.log(response.message);
            this.$toast("网络不佳请稍后再试");
            this.loading = false;
          }
        }
      );
    },
    checkCode() {
      // var _this = this;
      if (this.loading) {
        return;
      }
      if (this.phone != this.checkedPhone) {
        this.$toast("手机号已更改,请重新获取验证码");
        return;
      }
      this.loading = true;
      this.$indicator.open({
        text: "验证中...",
        spinnerType: "fading-circle",
      });

      this.$api.post(
        "https://api.tigercoach.cn/open/tel/verify",
        {
          msg_id: this.msg_id,
          code: this.vcode,
        },
        (response) => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              // console.log(res.Data);
              // this.coachInfo = res.Data;
              // res.code

              if (res.Data.is_valid) {
                this.booking();
              } else {
                this.$toast("验证码错误!");
              }
            } else {
              // this.isExpire = true;
              this.$toast(res.Msg);
            }
          } else {
            this.$indicator.close();
            console.log(response.message);
            this.$toast("网络不佳请稍后再试");
            this.loading = false;
          }
        }
      );
    },
    getCode() {
      // var _this = this;
      if (this.loading || this.count < 60) {
        return;
      }
      if (!this.phone || !/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.$toast("请输入正确手机号");
        return;
      }
      this.$indicator.open({
        text: "发送中...",
        spinnerType: "fading-circle",
      });
      this.loading = true;
      this.$api.post(
        "https://api.tigercoach.cn/open/tel/send",
        {
          tel: this.phone,
        },
        (response) => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              this.$toast("发送成功");
              this.msg_id = res.Data.msg_id;
              this.checkedPhone = this.phone;
              this.step1 = false;
              this.step2 = true;
              this.step3 = false;
              this.$nextTick(() => {
                // this.$refs.phone_input.focus();
               document.getElementsByClassName("step2")[0].getElementsByClassName("mint-field-core")[0].focus();
              });
              let interval = setInterval(() => {
                this.count--;
                if (this.count <= 0) {
                  this.count = 60;
                  clearInterval(interval);
                }
              }, 1000);
            } else {
              // this.isExpire = true;
              this.$toast(res.Msg);
            }
          } else {
            this.$indicator.close();
            console.log(response.message);
            this.$toast("网络不佳请稍后再试");
            this.loading = false;
          }
        }
      );
    },

    getData() {
      if (this.loading) {
        return;
      }
      this.$indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle",
      });
      this.loading = true;
      this.$api.get(
        "https://api.tigercoach.cn/open/coach/info",
        {
          coachId: this.cid,
        },
        (response) => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              // console.log(res.Data);
              // res.Data.Appearances=[];
              // res.Data.plus=0;
              // res.Data.Certs="";
              if (!res.Data.Appearances || res.Data.Appearances.length == 0) {
                res.Data.Appearances = [
                  {
                    appearance: "https://promo.tigercoach.cn/img/no_photo.png",
                  },
                ];
              }
              // res.Data.introduce="sadf asdf s沙发士大夫撒旦法爱的色放送达UK和福克斯大富豪 第三方哈萨克京东方啥的看法双卡双待后方可健身房康师傅会计师打发会计师打发和卡萨丁发看见谁看见谁可是会计师费会计师费看见谁看见 ";
              this.coachInfo = res.Data;
            } else {
              this.$toast(res.Msg);
              this.isExpire = true;
            }
          } else {
            this.$indicator.close();
            console.log(response.message);
            this.loading = false;
            this.$toast("网络不佳请稍后再试");
          }
        }
      );
    },
  },
};
</script>
<style lang="less">
.phone_input {
  border-bottom: 1px solid #fff;
  &.mint-cell {
    background: none;
  }
  &:last-child {
    background: none;
  }
  .mint-cell-wrapper {
    background: none;
    .mint-field-core {
      background: #000;
      color: #fff;
      font-size: 24px;
    }
  }
}
</style>
<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #000;
}
.popUpImg {
  width: 100vw;
  height: 100vh;
  object-fit: contain;
}

.expire {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  .mt_100 {
    margin-top: 100px;
  }
  img {
    width: 100px;
  }

  .bottom {
    width: 100vw;
    .code {
      width: 130px;
    }
    position: absolute;
    left: 0;
    bottom: 60px;
  }
}

.certs {
  .cert_title {
    line-height: 20px;
    position: relative;
    height: 20px;
    .cert_title_sub {
      position: absolute;
      left: 0;
      top: 0;
    }
    .cert_title_main {
      img {
        height: 12px;
      }
    }
  }
  .cert_detail {
    border-radius: 5px;
    position: relative;
    img {
      height: 12px;
      position: absolute;
      top: 11px;
    }
    .before {
      left: 15px;
    }
    .after {
      right: 15px;
    }
  }
}
.page_bottom {
  padding-top: 60px;
  padding-bottom: 40px;
  .tit1 {
    line-height: 20px;
    img {
      height: 20px;
    }
  }
  .tit2 {
    font-size: 10px;
    color: #acacac;
  }
}
.swiper {
  width: 100vw;
  height: 133.33vw;
}
.swiper_con {
  width: 100vw;
  height: 133.33vw;
}
.sign_con {
  position: fixed;
  top: 50px;
  width: 80vw;
  left: 10vw;
  background: rgba(58, 58, 58, 1);
  border-radius: 5px;
}

// new

.top-title {
  box-sizing: border-box;
  width: 100%;
  height: 24px;
  line-height: 24px;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  padding-left: 15vw;
  background: linear-gradient(to right, rgb(66, 150, 254), rgb(138, 93, 254));
}
.coach_info_new {
  padding-top: 40px;
  padding-bottom:100px;
  .left_20 {
    padding-left: 15vw;
  }
  .name {
    border-bottom: 3px solid #000;
    padding-bottom: 10px;
  }
  .certs {
    .cert_title {
      line-height: 20px;
      position: relative;
      height: 20px;
      .cert_title_sub {
        position: absolute;
        left: 0;
        top: 0;
      }
      .cert_title_main {
        img {
          height: 12px;
        }
      }
    }
    .cert_detail {
      border-radius: 5px;
      position: relative;
    }
  }
  .class_count {
    display: inline-block;
  }

  .swiper_con_new {
    width: 100vw;
    box-sizing: border-box;
    overflow-x: scroll;
    white-space: nowrap;
    .img_con {
      width: 300px;
      height: 300px;
      background: #fff;
      display: inline-block;
      margin-left: 10px;
      &:first-child {
        margin-left: 15vw;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .book_btn {
    width: 280px;
    height: 40px;
    background: #000;
    // margin:30px auto;
    position: fixed;
    left: 50%;
    bottom: 30px;
    margin-left: -140px;
    // font-size:14px;
    line-height: 40px;
    text-align: center;
    color: #fff;
  }
  .book_modal {
    position: fixed;
    color: white;
    height: 100vh;
    width: 100vw;
    bottom: 0;
    left: 0;
    .book_box {
      height: 50vh;
      width: 100vw;
      position: absolute;
      left: 0;
      bottom: 0;
      overflow: hidden;
      .active-box {
        background: #000;
        position: absolute;
        left: 50%;
        bottom: 50px;
        height: 150vh;
        width: 150vh;
        // margin-left: -50%
        transform: translate(-50%, 50%);
        border-radius: 50%;
        animation: spread 0.5s ease-out;
      }
      .step1 {
        padding: 30px 20px 0 15vw;
        position: absolute;
        top: 0;
        left: 0;
        .step1_btn {
          width: 100%;
          height: 40px;
          margin-top: 17px;
          line-height: 40px;
          text-align: center;
          background: #fff;
          color: #000;
        }
      }
      .step3 {
        position: relative;
        height: 100%;
        .avatar_con {
          margin-top: 20px;
          .avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            border: 1px solid #fff;
            vertical-align: middle;
          }
          .logo {
            height: 56px;
            vertical-align: middle;
          }
        }
        .bottom_con {
          position: absolute;
          bottom: 40px;
          left: 15vw;
        }
        .wechat {
          height: 23vw;
        }
      }
    }
  }
}
@keyframes spread {
  from {
    width: 10px;
    height: 10px;
  }
  to {
    width: 110vh;
    height: 110vh;
  }
}
</style>
