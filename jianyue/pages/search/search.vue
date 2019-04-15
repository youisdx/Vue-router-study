<template>
	<view class="search">
		<input type="text" class="text1" placeholder="搜索文章,专题,用户,文集" />
		<image src="../../static/sousuo.png" class="img"></image>
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.search{
		display:flex;
		width:90% ;
		height:60upx;
		border:1px solid #000000;
		border-radius: 20px;
	}
	.text1{
		width:80%;
		height:40upx;
		border-right: 1px solid #B2B2B2;
		margin-top: 5upx;
		margin-left: 10upx;
		
	}
	.img{
		width:50upx;
		height:50upx;
		margin-left:20upx;
		margin-top:5upx;
	}

</style>
