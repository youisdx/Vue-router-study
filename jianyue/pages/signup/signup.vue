<template>
	<view class="container">
		<view class="shang">
		<input 	placeholder="输入手机号" type="number" v-model="mobile" required="required"/>
		</view> 
		<view class="xia">
		<view class="left">
		<input placeholder="输入验证码" type="number" v-model="verifyCode" required="required"/>
		</view>
		<view class="right">
			<span v-show="show" @tap="getCode()" class="text">获取验证码</span>
			<span v-show="!show"  class="count">{{count}}s后重新获得</span>
		</view>
		</view>
		<button @tap="checkCode" class="green-btn">下一步</button>
		</view>
</template>

<script>
	export default{
		data(){
  return {
   show: true,
   count: '',
   timer: null,
   mobile: '',
	verifyCode: ''
  }
 },
 onLoad() {},
 methods:{
   getCode(){
     const TIME_COUNT = 60;
	 var _this = this;
	 uni.request({
				url: this.apiServer + '/user/verify',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					mobile: _this.mobile
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '验证码已发送'
						});
						_this.disabled = true;
						console.log(_this.disabled);
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg
						});
					}
				}
			});
     if (!this.timer) {
       this.count = TIME_COUNT;
       this.show = false;
       this.timer = setInterval(() => {
       if (this.count > 0 && this.count <= TIME_COUNT) {
         this.count--;
        } else {
         this.show = true;
         clearInterval(this.timer);
         this.timer = null;
        }
       }, 1000)
      }
   },
	 	checkCode: function() {
			var _this = this;
			console.log(_this.verifyCode);
			uni.request({
				url: this.apiServer + '/user/check',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					mobile: _this.mobile,
					verifyCode: _this.verifyCode
				},
				success: res => {
					console.log(res.data);
					if (res.data.code === 0) {
						uni.navigateTo({
							url: '../password/password?mobile=' + _this.mobile
						});
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg
						});
					}
				}
			});
		}
 }
	}
</script>

<style>
	input {
		height: 50px;
		border-bottom: 1px solid #eee;
		margin-bottom: 5px;
	}
	.xia{
		display: flex;
		justify-content: center;
	}
	.left{
	flex: 1 1 70%;
	}
	.right{
	width: 120px;
	height: 50px;
	background-color:rgb(26,173,25);
	color: #FFFFFF;
	border-radius: 5px;
	line-height: 50px;
	flex: 1 1 30%;
	text-align: center;
	}
</style>
