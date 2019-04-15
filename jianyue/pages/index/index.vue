<template>

	<view class="container">
		<view class="top">
			<view class="top-left">
				<view class="top-left-box">
					<view class="box" v-show="!recommend">
						<navigator @tap="clickshow()">推荐</navigator>
					</view>
					<view class="box navigator" v-show="recommend">
						<navigator>推荐</navigator>
					</view>
				</view>
				<view class="top-left-box">
					<view class="box" v-show="!special">
						<navigator @tap="clickshow2()">专题</navigator>
					</view>
					<view class="box navigator" v-show="special">
						<navigator>专题</navigator>
					</view>
				</view>
				<view class="top-left-box">
					<view class="box" v-show="!serialize">
						<navigator @tap="clickshow3()">连载</navigator>
					</view>
					<view class="box navigator" v-show="serialize">
						<navigator>连载</navigator>
					</view>
				</view>
			</view>
			<view class="top-right">
				<view class="search">
					<navigator url="../search/search">
						<image src="../../static/search-grey.png"></image>
					</navigator>
				</view>
			</view>
		</view>

		<view class="article-box">
			<view class="article" v-for="(article, index) in articles" :key="index" v-show="recommend">
				<!-- 标题 -->
				<text class="article-title" @tap="gotoDetail(article.id)">{{ article.title }}</text>
				<!-- 大于等于三张图片的显示方式 -->
				<view class="" v-if="article.imgs.length >= 3">
					<view class="thumbnail-box">
						<view class="thumbnail-item" v-for="(item, index1) in article.imgs" :key="index1" v-if="index1 < 3">
							<image :src="item.imgUrl"></image>
						</view>
					</view>
				</view>
				<!-- 小于三种图片的显示方式 -->

				<view class="" v-else-if="article.imgs.length >= 1">
					<view class="text-img-box">
						<view class="left">


							<rich-text :nodes="(article.content)" bindtap="tap"></rich-text>

						</view>
						<view class="right">
							<image :src="article.imgs[article.imgs.length - 1].imgUrl"></image>
						</view>
					</view>
				</view>
				<!-- 没有图片的显示方式 -->
				<view class="box" v-else>

					<view class="content1">
						<rich-text :nodes="handleContent(article.content)" bindtap="tap"></rich-text>
					</view>
				</view>
				<!-- 文章作者等信息 -->
				<view class="article-info">
					<view class="article-left">
						<view class="author-avatar">
							<image :src="article.avatar" class="avatar small"></image>
						</view>
						<view class="author-name">
							<text class="info-text">{{ article.nickname }}</text>
						</view>
					</view>
					<view class="article-right">
						<view class="article-time">
							<text class="info-text">{{ handleTime(article.createTime) }}</text>
						</view>
					</view>


					<view>
						<graceHeader title="弹出层" desc="请点击按钮测试 ^_^ "></graceHeader>
						<view class="grace-bg-white grace-common-mt grace-padding grace-common-border">
							<view>
								<button  @tap="showBanner"><image src="../../static/fenxiang.png" class="tan"></image></button>
								<!-- <button type="primary" @tap="showBanner2" style="margin:15px 0;">打开弹出层演示2</button> -->
							</view>
						</view>
						<!-- 弹出层演示 1 -->
						<graceMaskView :show="show" bgcolor="#00C777" v-on:close="closeBanner">
							<view>
								<image src="../../static/default.png" style="width:100%; margin-top:25px; border-top-right-radius:5px; border-top-left-radius:5px;"
								 mode="widthFix"></image>
							</view>
							<view style="padding:25px; padding-bottom:30px;">
								<button type='warn' style="background:#F6644D; padding:0 20px;">一个按钮</button>
							</view>
						</graceMaskView>
						<!-- 
						<graceMaskView :show="show2" bgcolor="none" v-on:close="closeBanner2">
							<view @tap="tap2">
								<image src="http://static.hcoder.net/graceui/hb.png" style="width:100%; border-radius:5px;" mode="widthFix"></image>
							</view>
						</graceMaskView> -->
					</view>



				</view>
			</view>
		</view>

		<view class="btn">
			<navigator url="../write/write" hover-class="navigator-hover">
				<view class="btn-up">
					<image src="../../static/pan.png"></image>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
import graceMaskView from "../../graceUI/components/graceMaskView.vue";
	export default {
		data() {
			return {
				article: {
					aId: 0,
					title: '',
					content: '',
					nickname: '',
					createTime: ''
				},
				articles: [],
				recommend: true,
				special: false,
				serialize: false,
				show: false,

			};
		},

		onLoad: function() {
			this.getArticles();
		},
		onShow: function() {},
		onPullDownRefresh: function() {
			this.getArticles();
		},
			components :{
			graceMaskView
		},
		methods: {
			// 第1个演示 开启与关闭
			showBanner: function() {
				this.show = true;
			},
			closeBanner: function() {
				this.show = false;
			},


			clickshow: function() {
				this.recommend = true;
				this.special = false;
				this.serialize = false;
			},
			clickshow2: function() {
				this.recommend = false;
				this.special = true;
				this.serialize = false;
			},
			clickshow3: function() {
				this.recommend = false;
				this.special = false;
				this.serialize = true;
			},

			getArticles: function() {
				var _this = this;
				uni.request({
					url: this.apiServer + '/article/list',
					method: 'GET',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						_this.articles = res.data.data;
						for (var i = 0; i < _this.articles.length; i++) {
							_this.articles[i].createTime = this.handleTime(_this.articles[i].createTime);
							_this.articles[i].content = this.handleContent(_this.articles[i].content);
						}
					},
					complete: function() {
						uni.stopPullDownRefresh();
					}
				});
			},

			gotoDetail: function(aId) {
				uni.navigateTo({
					url: '../article_detail/article_detail?aId=' + aId
				})
			},

			handleTime: function(date) {
				var d = new Date(date);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
				var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
				var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
				return year + '-' + month + '-' + day + ' ' + hour + ":" + minutes + ':' + seconds
			},

			handleContent: function(msg) {
				let description = msg;
				description = description.replace(/(\n)/g, "");
				description = description.replace(/(\t)/g, "");
				description = description.replace(/(\r)/g, "");
				description = description.replace(/<\/?[^>]*>/g, "");
				description = description.replace(/\s*/g, "");
				return msg.substring(0, 50);;
			},
			//         window.onload=function(){
			// 			var oBth=document.getElementById
			// 		}
		}
	}
</script>

<style scoped>
	.article-box {
		/* border: 1px solid #FF3A30 ; */
	}

	.article {
		margin-bottom: 10px;
		background: #ffffff;
	}

	.article-title {
		font-size: 13pt;
		font-weight: 700;
	}

	/* 大于三张 */
	.thumbnail-box {
		margin-top: 5px;
		margin-bottom: 5px;
		display: flex;
		flex: 1 1 30%;
		/* border: 1px solid #10AEFF; */
	}

	.thumbnail-item {
		margin-right: 5px;

		height: 100px;
		flex: 1 1 30%;
		/* border: 1px solid black; */
	}

	.thumbnail-item image {
		border-radius: 10px;
		width: 100%;
		height: 100%;
	}

	/* 小于三张 */
	.text-img-box {
		display: flex;
	}

	.left {
		flex: 1 1 70%;
	}

	.right {
		flex: 1 1 30%;
		height: 100px;
	}

	.right image {
		border-radius: 10px;
		height: 100%;
		width: 100%;
	}

	/* 无图 */

	.article-text {
		width: 100%;
		/* border:  1px solid #000000; */
	}



	/* 作者信息 */
	.article-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* border: 1px solid #000000; */
	}

	.article-left {
		display: flex;
		align-items: center;
	}

	.author-avatar {
		margin-right: 15px;
		width: 40px;
		height: 40px;
	}

	.author-avatar image {
		width: 100%;
		height: 100%;
	}

	.author-name {
		margin-right: 15px;
		font-size: 11pt;
		color: rgb(110, 110, 110)
	}

	.article-time {
		font-size: 11pt;
		color: rgb(110, 110, 110)
	}

	/* 顶部导航栏 */
	.container {
		font-size: 13pt;
		background: #eeeeee;
	}

	.top {
		width: 100%;
		height: 35px;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #aaa;
		/* border: 1px solid #00B26A; */
	}

	.top-left {
		margin-left: 3px;
		display: flex;
		width: 50%;
		/* border: 1px solid #007AFF; */
	}

	.top-left-box {
		height: 100%;
		display: flex;
		flex: 1 1 30%;
	}

	.top-right {
		margin-right: 10px;
		/* border: 1px solid #007AFF; */
	}

	.navigator {
		color: #fd572b;
		border-bottom: 2px solid #fd572b;
	}

	.search image {
		width: 32px;
		height: 32px;
	}

	/* 底部创建文章按钮 */
	.btn-up {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: #9370db;
		position: fixed;
		bottom: 30px;
		right: 10px;
	}

	.btn-up image {
		width: 100%;
		height: 100%;
	}

	.tan {
		width: 15px;
		height: 15px;
		margin-right: 10px;
	}

	
</style>
