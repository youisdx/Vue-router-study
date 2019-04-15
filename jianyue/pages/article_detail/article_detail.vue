<template>
	<view class="container">
		<text class="article-title">{{ article.title }}</text>
		<view class="title-time">
			<view class="article-author">
				<view class="author-avatar">
					<image :src="article.avatar" class="avatar small"></image>
				</view>
				<view class="author-name">
					<text>{{ article.nickname }}</text>
				</view>
			</view>
			
			<view class="article-button">
				<view><button v-if="userId != article.uId && !followed" class="butt" @tap="follow"><text class="a">关注</text> </button></view>
				<view><button v-if="userId != article.uId && followed" class="butt1" @tap="cancelFollow"><text class="a">取消</text> </button></view>
			</view>
			
		</view>
		<view class="read">
			<view class="read-box">
				<text class="read-text">字数 {{ article.content.length }} · 阅读 {{ comments.length }}</text>
			</view>
			<view class="read-box">
				<text class="time-text">{{ handleTime(article.createTime) }}</text>
			</view>
		</view>
		
		
		<view class=" grace-text"><rich-text :nodes="article.content" bindtap="tap"></rich-text></view>
		
		<view class="article-button">
			<view><button v-if=" !liked" class="butt2" @tap="like"><text class="a">喜欢</text> </button></view>
			<view><button v-if=" liked" class="butt1" @tap="cancelLike"><text class="a">取消</text> </button></view>
		</view>
		<view class="bottom-comment">
			<view class="info-text-box">
				<text class="info-text">评论  ( {{ comments.length }} )</text>
			</view>
			
			<view class="comment-item" v-for="(comment, index) in comments" :key="index">
				<view class="left">
					<view class="comment-avatar">
						<image :src="comment.avatar" class="avatar small"></image>
					</view>
				</view>
				<view class="right">
					<view class="comment-name">
						<text>{{ comment.nickname }}</text>
					</view>
					<view class="comment-second">
						<text>{{ comment.content }}</text>
					</view>
					<view class="comment-time">
						<text style="margin-right: 10px;">{{ comments.length - index }}楼</text>
						<text>{{ handleTime(comment.commentTime) }}</text>
					</view>
				</view>
			</view>
			<view class="comment-input">
				<input class="uni input comment-box" type="text" placeholder="写下你的评论" v-model="content" required="required" />
			</view>
			<view class="comment-btn">
				<button type="primary" @tap="send">提交</button>
			</view>
			
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			article: {
				aId: 0,
				uId: 0,
				title: '',
				content: '',
				avatar: '',
				nickname: '',
				createTime: ''
			},
			comments: [],
			content: '',
			userId: uni.getStorageSync('login_key').userId,
			followed: false,
			liked:false
			
		};
	},
	onLoad: function(option) {
		//option为object类型，会序列化上个页面传递的参数
		this.article.aId = option.aId;
	},
	onShow: function() {
		this.getArticle();
	},
	onPullDownRefresh: function() {
		this.getArticle();
	},
	methods: {
		getArticle: function() {
			var _this = this;
			uni.request({
				url: this.apiServer + '/article/' + this.article.aId,
				method: 'GET',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					userId: this.userId
				},
				success: res => {
					// console.log(res.data.data.article);
					_this.article.aId = res.data.data.article.id;
					_this.article.uId = res.data.data.article.uid;
					_this.article.title = res.data.data.article.title;
					_this.article.content = res.data.data.article.content;
					_this.article.nickname = res.data.data.article.nickname;
					_this.article.avatar = res.data.data.article.avatar;
					_this.article.createTime = res.data.data.article.createTime;
					_this.comments = res.data.data.comments;
					if (res.data.data.followed === '已关注') {
						_this.followed = true;
					}
				},
				complete: function() {
					uni.stopPullDownRefresh();
				}
			});
		},
		handleTime: function(date) {
			var d = new Date(date);
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
			var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
			var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
			var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
			return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
		},
		send: function() {
			console.log('评论人编号：' + this.userId + ',文章编号：' + this.article.aId + '，评论内容：' + this.content);
			uni.request({
				url: this.apiServer + '/comment/add',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					aId: this.article.aId,
					uId: this.userId,
					content: this.content
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '评论成功'
						});
						this.getArticle();
						this.content = '';
					}
				}
			});
		},
		follow: function() {
			uni.request({
				url: this.apiServer + '/follow/add',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					fromUId: this.userId,
					toUId: this.article.uId
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '关注成功'
						});
						this.followed = true;
					}
				}
			});
		},
		cancelFollow: function() {
			uni.request({
				url: this.apiServer + '/follow/cancel',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					fromUId: this.userId,
					toUId: this.article.uId
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '已取消关注'
						});
						this.followed = false;
					}
				}
			});
		},
		
		like: function() {
			uni.request({
				url: this.apiServer + '/like/add',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					fromlikeUId: this.userId,
					tolikeUId: this.article.uId
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '喜欢成功'
						});
						this.liked = true;
					}
				}
			});
		},
		cancelLike: function() {
			uni.request({
				url: this.apiServer + '/like/cancel',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					fromlikeUId: this.userId,
					tolikeUId: this.article.uId
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '已取消喜欢'
						});
						this.liked = false;
					}
				}
			});
		},
		
		
		
		
		
	}
};
</script>

<style scoped>
	/* 标题 */
.article-title {
	font-weight: bold;
	font-size: 22px;
}
/* 内容 */
.title-time {
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}
/* 作者 头像 名称 */
.article-author{
	display: flex;
	align-items: center;
}
.author-avatar{
	margin-right: 20px;
	width: 40px;
	height: 40px;
}
.author-avatar image{
	width: 100%;
	height: 100%;
}
.author-name{
	font-size: 11pt;
	font-weight: 400;
}
/* 关注按钮 */
.article-button{
	margin-right: 20px;
	align-items: center;
	justify-content: center;
}
.a{
	display: flex;
	align-items: center;
}
.butt {
	background-color: #00c777;
	color: #F8F8F8;
	height: 70upx;
	width: 190upx;
	display: flex;
	text-align: center;
	justify-content: center;
}
.butt1 {
	background-color: rgb(230, 230, 230);
	color: white;
	height: 70upx;
	width: 190upx;
	display: flex;
	text-align: center;
	justify-content: center;
}
.butt2 {
	background-color: #E2231A;
	color: white;
	height: 70upx;
	width: 190upx;
	display: flex;
	text-align: center;
	justify-content: center;
}

/* 字数 阅读  时间 */
.read{
	margin-top: 10px;
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
}
.read-box{
	font-size: 11pt;
}
.read-text {
	color: rgb(110, 110, 110);
}
.time-text {
	color: rgb(110, 110, 110);
	float: right;
	/* padding-top: 35upx; */
}
/* 底部评论 */
.info-text-box{
	
	font-size: 13pt;
	color: rgb(110, 110, 110);
}
.comment-item {
	display: flex;
	margin-bottom: 5px;
}
.left{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
}
.comment-avatar{
	height: 40px;
	width: 40px;
}
.comment-avatar image{
	height: 100%;
	width: 100%;
}
.comment-name{
	font-size: 12pt;
	font-weight: 800;
}
.comment-second{
	font-size: 11pt;
	font-weight: 500;
}
.comment-time{
	font-size: 9pt;
	font-weight: 200;
}
/* 评论输入框 */
.comment-input{
	margin-top: 10px;
	margin-bottom: 10px;
	
}

</style>
