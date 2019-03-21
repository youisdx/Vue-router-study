<template>
	<div id="app" class="container">
		<div class="header">
			<div class="ss"><img src="https://static.cdn.oss.mosoteach.cn/mosoteach2/common/images/logo.png"></div>
		
			<router-link to="/task" class="nav-item">任务中心</router-link>
			<router-link to="/lib" class="nav-item">库管理</router-link>
			<router-link to="/ucenter" class="nav-item">赵鹏飞</router-link>

		</div>
		<div class="content">
			<router-view></router-view>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'App'
	};
</script>

<style>
.header {
	display: flex;
	height: 60px;
	background-color: white;
	font-size: 20px;
	padding-left: 120px;
	align-items: center;
	justify-content: space-between;
}
#app{
	background-color: rgb(244,244,244);
}
.container {
	width: 80%;
	margin: 0 auto;
	height: 700px;
}

.nav-item {
	width: 100px;
	margin-right: 20px;
	
}
.mclass{
	width: 169px;
	height: 50px;
}

a{
	text-decoration: none;
	color: #aaa;
}
a:hover{
	color: rgb(2,165,218);

}
</style>


