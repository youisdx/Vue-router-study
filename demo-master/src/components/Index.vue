<template>
	<!-- 根容器 -->
	<div class="container">
		<router-link to="/new_course"><button class="btn">新建班课</button></router-link>

		<div class="top">
			<p>进行中的班课</p>
			<p>{{courses.length}}个进行中的班课</p>
		</div>
		<hr>
		<div class="course-conainer">
			<div class="course" v-for="(course, index) in courses" :key="index">
				<div class="course-cover">
					<router-link :to="'/course/' + course.courseId">
						<img :src="course.cover" />
					</router-link>
				</div>
				<div class="course-class">
					<p class="title">{{ course.courseClass }}</p>
				</div>
				<div class="course-name">
					<p class="title">{{ course.courseName }}</p>
				</div>
				<div class="teacher">
					<div class="left">
						<div class="avatar">
							<img :src="course.avatar">
						</div>
						<div class="username">
							<p class="code">{{course.username}}</p>
						</div>
					</div>
					<div class="course-code">
						<p class="code" v-if="loginUserId === course.userId">{{course.courseCode}}</p>
					</div>
				</div>

			</div>
		</div>

		<div class="top">
			<p>已结束的班课</p>
			<p>{{finishcourses.length}}个结束的班课</p>
		</div>
		<hr>
		<div class="course1-conainer">
			<div class="course" v-for="(course, index) in finishcourses" :key="index">
				<div class="course-cover">
					<img :src="course.cover" />
				</div>
				<div class="course-class">
					<p class="title">{{ course.courseClass }}</p>
				</div>
				<div class="course-name">
					<p class="title">{{ course.courseName }}</p>
				</div>
				<div class="teacher">
					<div class="left">
						<div class="avatar">
							<img :src="course.avatar">
						</div>
						<div class="username">
							<p class="code">{{course.username}}</p>
						</div>
					</div>
					<div class="course-code" v-if="loginUserId === course.userId">
						{{ course.courseCode }}
						<button @click="deleteCourse(course.courseId,index)" class="btn">删除</button>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
	export default {
		name: 'Index',
		data() {
			return {
				loginUserId: 1,
				courses: [],
				finishcourses: []
			};
		},
		methods: {
			deleteCourse: function(courseId, index) {
				var _this = this;
				this.$http({
					method: 'delete',
					url: 'http://localhost:8080/api/course/' + courseId
				}).then(function() {
					alert('班课删除成功');
					_this.courses.splice(index, 1);
				});
			}
		},
		created() {
			var _this = this;
			this.$http.get('http://localhost:8080/api/courses').then(function(response) {
				_this.courses = response.data;
			});
			this.$http.get('http://localhost:8080/api/courses1').then(function(finish) {
				_this.finishcourses = finish.data;
			})
		}
	};
</script>
<style scoped>
	.container {
		padding-top: 20px;
	}

	.course-conainer {
		display: flex;
		flex-wrap: wrap;
	}

	.course1-conainer {
		display: flex;
		flex-wrap: wrap;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
	}

	.course {
		width: 260px;
		height: 420px;
		margin-right: 20px;
		margin-bottom: 30px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding-bottom: 10px;
	}


	.course-cover img {
		width: 100%;
		height: 280px;
	}

	.title {
		font-size: 16px;
		color: #333;
	}

	.btn {
		width: 120px;
		height: 40px;
		border: 1px solid #fff;
		background-color: rgb(0, 187, 221);
		border-radius: 20px;
		outline: none;
		color: #fff;
		font-size: 16px;
	}

	.course-code {
		color: rgb(0, 187, 221);
	}

	.teacher {
		display: flex;
		justify-content: space-between;
	}

	.left {
		display: flex;
	}

	.avatar img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		margin-right: 5px;
	}

	.code {
		color: #00BBDD;
		margin-top: 5px;
	}

	.top {
		width: 90%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}
</style>
