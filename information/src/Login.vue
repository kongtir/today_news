<template>
	<div class="login">
		<div class="userContainer">
			<div class="user-con">
				<h2>今日头条精选后台系统</h2>
				<el-form :model="form"  size=''>
				    <el-form-item>
				      <el-input v-model="form.username" placeholder="用户名"></el-input>
				    </el-form-item>
				    <el-form-item>
				      <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
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
		left: 0;
		top: 0;
		padding: 75px 0 75px 0;
		background:#d2d2ce;
		
	}
	.login .userContainer{
		width: 920px;
		height: 480px;
		margin: 0 auto;
		position: relative;
		background-image: url('./images/user-bg1.jpg');
		overflow: hidden;
		box-shadow: 0 0 6px #fff;
		border-radius: 4px;
	}	
	.login .userContainer .user-con{
		position: absolute;
		width: 320px;
		height: 400px;
		right: 20px;
		top: 40px;
		border: 2px solid #ccc;
		padding: 10px;
		text-align: center;
		background: #fff;
		border-radius: 4px;
		opacity: 0.8;
	}
	.user-con h2{
		margin-top: 10px;
	}
	.user-con .el-form{
		margin-top: 40px;
	}
	.user-con .userBtn{
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #51534a;
		border-radius: 4px;
		margin-top: 40px;
	}
	.user-con .userBtn>a{
		color: #fff;
	}
	.el-form .el-input__inner{
		border-color: #aaa99f;
	}
</style>