<template>
	<div class="login">
		<div class="user-header">
			<div class="logo">
				<div><i></i></div>
				<div>新闻热点精选后台系统</div>
			</div>
		</div>
		<div class="userContainer">
			<div class="user-bg">
				<img src="./images/banner_pic.jpg" alt="">
			</div>
			<div class="user-con">
				<div class="userDiv">欢迎登陆</div>
				<el-form :model="form">
				    <el-form-item>
				      <el-input v-model="form.username" size='small' placeholder="用户名"></el-input>
				    </el-form-item>
				    <el-form-item>
				      <el-input v-model="form.password" size='small' type="password" placeholder="密码"></el-input>
				    </el-form-item>
				</el-form>
				<div class="userBtn" @click='login'><a href="#">登录</a></div>
			</div>
		</div>		
	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default {
		data(){
			return {
				form: {}
			}
		},
		methods: {
			login(){
				axios.post('/login',this.form).then(({data:result})=>{
					console.log('success',result);
					//this.$root.currentComponent = 'App';
					if(result.status == 200 && result.message == '登录成功'){
						//1.跳转到后台页面
						window.vm.currentComponent = 'App';
						//2.将登录成功的用户信息保存到浏览器中
						localStorage.setItem('user',JSON.stringify(result.data));
					}
				}).catch((error)=>{
					console.log('error',error);
				});
			}
		}
	}
	
	
</script>
<style>
	.login{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0px;
		background:#006098;	
	}
	.login .userContainer{
		width: 100%;
		position: relative;
		height: 100%;
		overflow: hidden;
	}
	.login .userContainer .user-bg>img{
		position: absolute;
		left: -200px;
		top: 100px;
	}	
	.login .userContainer .user-con{
		position: absolute;
		width: 360px;
		height: 280px;
		right: 160px;
		top: 140px;
		border: 1px solid #ddd;
		padding: 20px 40px;
		background: #fff;
		border-radius: 2px;
	}
	.user-header{
		position: absolute;
		left:0;
		top: 0;
		width: 100%;
		height: 100px;
		background: #006098;
	}
	.user-header .logo>div{
		color: #fff;
		font-size:22px;
		line-height:100px;
		margin-left: 200px;
	}
	.user-header .logo>div:first-child{
		float:left;
		background: #006098;
	}
	.user-con .userDiv{
		margin-top: 10px;
		font-size: 20px;
		color: #006098;
	}
	.user-con .el-form{
		margin-top: 20px;
	}
	.user-con .userBtn{
		width: 280px;
		height: 40px;
		line-height: 40px;
		background: #006098;
		border-radius: 4px;
		margin-top: 20px;
		text-align: center;
		margin-left: 0px;
	}
	.user-con .userBtn>a{
		color: #fff;
	}
	.el-form .el-input__inner{
		border-color: #ddd;
		width: 280px;
		height: 40px;
	}
</style>