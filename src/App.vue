<template>
  <div id="app">
    <div class="coachInfo" v-show="coachInfo.name">
      <mt-swipe :auto="3000" class="swiper ta_c">
        <mt-swipe-item class="swiper" v-for="(item,index ) of coachInfo.Appearances" :key="index">
          <div class="img_con swiper_con">
            <img :src="item.appearance" class="bg" alt />
            <img :src="item.appearance" class="main" alt />
          </div>
        </mt-swipe-item>
      </mt-swipe>
      <div class="info_con pd_15">
        <div class="name_con ta_l">
          <span class="name float_l fw_b fs_16">{{coachInfo.name}}</span>
          <mt-button size="small" class="fl_r name_btn" type="primary" @click="showSign=true">
            <img src="@/assets/icon4@2x.png" />免费咨询
          </mt-button>
        </div>
        <div class="intro pd_15 mt_15">
          <div class="location pb_15 ta_r">
            <img class="pr_15 vt_m" src="@/assets/location@2x.png" />
            {{coachInfo.city}}
          </div>
          <div
            class="intro_detail"
            :style="{'-webkit-line-clamp': isShowIntro?'unset':2,}"
          >{{coachInfo.introduce}}</div>
          <div class="ta_c mt_10" @click="isShowIntro=!isShowIntro">
            <img class="down" :class="{show:isShowIntro}" src="@/assets/down.png" alt />
          </div>
        </div>
        <div class="certs mt_15">
          <div class="cert_title">
            <span class="cert_title_sub fs_16 fw_b">证书</span>
            <div class="cert_title_main ta_c fs12 vt_m">
              <img class="vt_m pr_10" src="@/assets/icon2@2x.png" />职业资格证书已经过老虎运动的真实性核查
            </div>
          </div>
          <div
            class="cert_detail mt_15 fs_12"
            v-for="(item,index ) in coachInfo.Certs"
            :key="index"
          >
            <img class="before" src="@/assets/icon1@2x.png" alt />
            {{item.certname}}
            <img class="after" src="@/assets/location@2x.png" alt />
          </div>
        </div>
      </div>
      <div class="page_bottom ta_c">
        <div class="fs_12 tit1">
          <img class="vt_m pr_15" src="@/assets/LOGO2@2x.png" />老虎教练
        </div>
        <div class="mt_10 tit2">使用中国最大的健身教练app老虎教练生成</div>
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

    <!-- <sign msg="Welcome to Your Vue.js App"/> -->

    <div class="sign_con" v-show="showSign">
      <div class="close" @click="showSign=false;showSuccess=false">
        <img src="@/assets/sign/icon3@2x.png" alt />
      </div>
      <div class="sign" v-if="!showSuccess">
        <div class="form ta_c pd_15">
          <div class="tit1 fs_16">
            <img class="vt_m pr_15" src="@/assets/sign/LOGO1@2x.png" />老虎教练
          </div>
          <div class="input_con">
            <img src="@/assets/sign/icon1@2x.png" alt />

            <input type="number" placeholder="请输入手机号" v-model.trim="phone" />
          </div>
          <div class="input_con">
            <img src="@/assets/sign/icon2@2x.png" alt />
            <input type="number" placeholder="请输入验证码" v-model.trim="vcode" />
            <mt-button
              size="normal"
              @click="getCode"
              :class="{counting:count<60}"
              class="acode fl_r name_btn"
              type="primary"
            >{{count==60?"验证码":count+"s"}}</mt-button>
          </div>
          <mt-button size="large" class="mt_40" @click="checkCode" type="primary">提交</mt-button>
        </div>
        <div class="sign_info pd_15">
          <span>
            <img src="@/assets/sign/lock@2x.png" alt />
          </span>
          服务由健身教练和其他服务商提供。提交您的个人资料，即 代表您同意授权⽼⻁运动使⽤您提交的个⼈资料和联系信息 并将为您提供服务所必须的联系资料分享给第三⽅。⽼⻁运 动和第三⽅会对的个⼈资料进⾏严格的保护。
        </div>
      </div>
      <div class="success ta_c pd_15" v-show="showSuccess">
        <img class="mt_30" src="@/assets/success/icon1@2x.png" alt />
        <p class="mt_10">提交成功</p>
        <p class="mt_40 lh_12">⽼⻁教练 已通知</p>
        <p class="lh_12">{{coachInfo.name}}</p>
        <p class="lh_12">在24⼩时内通过预留的⼿机号码与您联系</p>
        <img class="code mt_15" src="@/assets/wechat.jpeg" alt />
        <p class="mt_15 fs_10">如需更多服务，请关注⽼⻁运动公众号</p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "./servers/utils.js";
import logo from "./assets/LOGO2@2x.png";

export default {
  name: "app",
  components: {
    // sign
  },
  data() {
    return {
      cid: "",
      code: "",
      isShowIntro: false,
      coachInfo: {
        Appearances: []
      },
      isExpire: false,
      isSigned: false,
      loading: false,
      showSign: false,
      showSuccess: false,
      phone: "",
      vcode: "",
      base64code: "",

      count: 60,
      msg_id: "",
      checkedPhone: ""
    };
  },
  created() {
    var cid = utils.getQueryString("state");
    var code = utils.getQueryString("code");
    this.code = code;
    if (!this.code) {
      this.$toast({
        message: "未能获取你的用户信息，请重新打开尝试。",
        duration: 5000
      });
    }
    this.initConfig();
    this.base64code = btoa("0d3f69db66c7f0140c46a6d4:def15da9fc5c53c5119627e4");
    if (!cid) {
      this.isExpire = true;
    } else {
      this.cid = cid;
      this.getData();
    }
  },
  methods: {
    initConfig() {
      var _this = this;
      
      this.$api.post(
        "https://api.tigercoach.cn/v3.5/port/wx/js/signature",
        {
          // url: window.location.href
          url: "https://promo.tigercoach.cn/coach/index.html?state=1NEbUPXJQFONmj7L3rOQSOvNuTr"
        },
        response => {
          if (response.status >= 200 && response.status < 300) {
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              _this.initWx(res.Data);
            } 
          } 
        },
        {
          token:"admin_123"
        }
      );
    },
    initWx(data) {
      console.log(data);
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone"
        ] // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
      });
      wx.ready(function() {
        wx.onMenuShareTimeline({
          title: this.coachInfo.name+"", // 分享标题
          link: "https://promo.tigercoach.cn/coach/index.html?state="+this.cid, // 分享链接
          imgUrl: this.coachInfo.Appearances[0].appearance||logo, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: this.coachInfo.name+" 在老虎教练等你", // 分享标题
          link: "https://promo.tigercoach.cn/coach/index.html?state="+this.cid, // 分享链接
          imgUrl: this.coachInfo.Appearances[0].appearance||logo, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQQ({
          title: "", // 分享标题
          desc: "", // 分享描述
          link: "", // 分享链接
          imgUrl: "", // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQZone({
          title: "", // 分享标题
          desc: "", // 分享描述
          link: "", // 分享链接
          imgUrl: "", // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
      wx.error(function(res) {
        console.log(res);
      });
    },
    booking() {
      var _this = this;
      if (this.loading) {
        return;
      }

      this.$indicator.open({
        text: "发送中...",
        spinnerType: "fading-circle"
      });
      this.loading = true;
      this.$api.post(
        "https://api.tigercoach.cn/open/reference/coach/customer",
        {
          coach_id: this.cid,
          customer_tel: this.phone,
          customer_code: this.code
        },
        response => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            // this.showSuccess=true;
            if (res.Code == 200 && res.Data) {
              // console.log(res.Data);
              // this.coachInfo = res.Data;
              // res.code;
              this.$toast(res.Msg);
              this.showSuccess = true;
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
      var _this = this;
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
        spinnerType: "fading-circle"
      });

      this.$api.post(
        "https://api.tigercoach.cn/open/tel/verify",
        {
          msg_id: this.msg_id,
          code: this.vcode
        },
        response => {
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
                this.$toast(res.Msg);
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
      var _this = this;
      if (this.loading && this.count < 60) {
        return;
      }
      console.log("嘚瑟是的是的士大夫第三方");
      this.$indicator.open({
        text: "发送中...",
        spinnerType: "fading-circle"
      });
      this.loading = true;
      this.$api.post(
        "https://api.tigercoach.cn/open/tel/send",
        {
          tel: this.phone
        },
        response => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              // console.log(res.Data);
              // this.coachInfo = res.Data;
              // res.code
              this.$toast("发送成功");
              this.msg_id = res.Data.msg_id;
              this.checkedPhone = this.phone;
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
        spinnerType: "fading-circle"
      });
      this.loading = true;
      this.$api.get(
        "https://api.tigercoach.cn/open/coach/info",
        {
          coachId: this.cid
        },
        response => {
          this.loading = false;
          this.$indicator.close();
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            let res = response.data;
            if (res.Code == 200 && res.Data) {
              console.log(res.Data);
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
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #ddd;
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
.sign_con {
  position: fixed;
  top: 50px;
  width: 80vw;
  left: 10vw;
  background: rgba(58, 58, 58, 1);
  border-radius: 5px;
  min-height: 50vw;
  input {
    color: #ddd;
  }
  .sign {
    .form {
      .tit1 {
        margin-top: 30px;
        line-height: 25px;
        margin-bottom: 40px;
        img {
          height: 20px;
          width: 20px;
          margin-top: -2px;
        }
      }
      .input_con {
        margin-top: 10px;
        position: relative;
        line-height: 40px;
        .acode {
          position: absolute;
          right: 10px;
          top: 7px;
          height: 26px;
          background: rgba(255, 34, 71, 0) !important;
          border: 1px solid rgba(255, 34, 71, 0.58);
          border-radius: 16px;
          color: rgba(255, 34, 71, 0.58);
          padding-left: 20px;
          padding-right: 20px;
          &.counting {
            color: #ddd;
            border-color: #ddd;
          }
        }
        img {
          height: 18px;
          position: absolute;
          top: 11px;
          left: 10px;
          display: inline-block;
          padding-right: 10px;
          border-right: 1px solid #ddd;
        }
        input {
          width: 100%;
          line-height: 40px;
          background: #303030;
          padding: 0 40px;
          box-sizing: border-box;
          border-radius: 5px;
          border: none;
        }
      }
    }
    .sign_info {
      position: relative;
      padding: 15px 15px;
      margin-top: 40px;
      border-top: 1px dashed #ddd;
      span {
        width: 60px;
        display: line-block;
        position: absolute;
        top: -8px;
        left: 50%;
        color: #585858;
        transform: translateX(-50%);
        background: rgba(58, 58, 58, 1);
        text-align: center;
        img {
          height: 12px;
        }
      }
    }
  }
  .success {
    .lh_12 {
      line-height: 1.2;
    }
    .code {
      width: 130px;
    }
    img {
      width: 73px;
    }
  }
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    img {
      height: 20px;
      width: 20px;
    }
  }
}
.name_con {
  .name {
    line-height: 33px;
  }
  .name_btn {
    width: 200px;

    img {
      height: 12px;
      padding-right: 10px;
      vertical-align: middle;
    }
  }
}
.intro {
  background: rgba(58, 58, 58, 1);
  border-radius: 5px;
  .location {
    img {
      height: 12px;
    }
  }
  .intro_detail {
    color: #7e7d7d;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    // -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .down {
    transition: all 0.8s;

    width: 16px;
    &.show {
      transform: rotate(-180deg);
    }
  }
}

.certs {
  .cert_title {
    line-height: 20px;
    position: relative;
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
    background: rgba(58, 58, 58, 1);
    border-radius: 5px;
    position: relative;
    line-height: 34px;
    padding: 0 40px 0 40px;
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
</style>
