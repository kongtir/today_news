<template>
	<div class="user">
		<div class="userBtn">
			<el-button type="primary" size="mini" @click="toAddUser">新增用户</el-button>
		</div>
		<!-- 卡片开始 -->
		<el-card class="box-card" v-for="user in users" :key="user.id" :value="user.id">
		  	<div slot="header" class="clearfix">
		    	<div class="userFace">
		    		<img src="../images/mty01.jpg" alt="">
		    		<span class="opeUser">
		    			<i class="fa fa-trash" title="删除" @click="delUser(user.id)"></i>
		    			<i class="fa fa-pencil-square" title="修改" @click="updateUser(user)"></i>
		    		</span>
		    	</div>
		  	</div>
		  	<div class="text item">
		    	<ul>
		    		<li>用户名: &nbsp;&nbsp;{{user.username}}</li>
		    		<li>真实姓名: &nbsp;&nbsp;{{user.nickname}}</li>
		    		<li>邮箱: &nbsp;&nbsp;{{user.email}}</li>
		    		<li>注册时间: &nbsp;&nbsp;{{user.regTime}}</li>
		    		<li>
		    			用户状态: &nbsp;&nbsp;<el-switch v-model="user.enabled"
		    			active-color="#006098" inactive-color="#ff4949" @change="statusChange">
						</el-switch>
		    		</li>
		    	</ul>
		  	</div>
		</el-card>
		<!-- 卡片结束 -->
		<!-- 模态框开始 -->
		<el-dialog :title="userDialog.title" :visible.sync="userDialog.visible" :close-on-click-modal="false">
			<el-form :model="userDialog.form">
			    <el-form-item label="用户名" label-width="120px">
			      	<el-input v-model="userDialog.form.username" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			     <el-form-item label="密码" label-width="120px">
			      	<el-input type="password" v-model="userDialog.form.password" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			     <el-form-item label="确认密码" label-width="120px">
			      	<el-input type="password" v-model="userDialog.form.password1" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			     <el-form-item label="真实姓名" label-width="120px">
			      	<el-input v-model="userDialog.form.nickname" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			     <el-form-item label="邮箱" label-width="120px">
			      	<el-input v-model="userDialog.form.email" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button size="small">取 消</el-button>
			    <el-button type="primary" size="small" @click="saveOrUpdateUser">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 模态框结束 -->

	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				users: [],
				value: '',
       			userDialog: {
					title: '',
					form: {
						password1:''
					},
					visible: false,
				},

			}
		},
		created(){
			//加载所有栏目信息
			this.findAllUsers();
		},
		methods:{
			//修改用户信息
			updateUser(user){
				this.userDialog.visible = true;
				this.userDialog.title = '修改用户信息';
				this.userDialog.form = user;
			},
			//删除用户
			delUser(id){
				this.$confirm('此操作将永久删除该用户，是否继续？','提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
					let url = '/manager/user/deleteUserById?id='+id;
					axios.get(url).then(({data:result})=>{
						this.$notify({
							title: '删除成功',
							message: result.message,
							type: 'success'
						});
						this.findAllUsers();

					}).catch(()=>{
						this.$notify.error({
							title: '错误',
							message: '删除失败'
						});
					});
				}).catch(()=>{
					this.$notify.error({
						title:'错误',
						message: '网络异常'
					});
				});	
			},
			statusChange(value){
				this.value = value;
				this.changeStatus(this.value);
			},
			//修改用户状态
			changeStatus(){
				let url = '/manager/user/changeStatus?id=0&status='+this.value;
				axios.post(url,this.value).then(({data:result})=>{
					console.log(result);
					this.$notify({
					    title: '状态修改成功',
					    message: result.message,
					    type: 'success'
					});
				}).catch((error)=>{
					console.log('error',error);
				});
			},
			//关闭模态框
			closeUserDialog(){
				this.userDialog.form = {};
				this.userDialog.visible = false;
			},
			//保存用户信息
			saveOrUpdateUser(){
				if(this.userDialog.form.password == this.userDialog.form.password1){
					let url = '/manager/user/saveOrUpdateUser';
					axios.post(url,this.userDialog.form).then(({data:result})=>{
						if(result.status == 200){
							//关闭模态框
							this.closeUserDialog();
							//提示成功信息
							this.$notify({
						        title: '成功',
						        message: result.message,
						        type: 'success'
						    });
						    //刷新数据
						    this.findAllUsers();
						}else{
							this.$notify.error({
					          	title: '错误',
					          	message: result.message
					        });
						}
					}).catch(()=>{
						this.$notify.error({
				          	title: '错误',
				          	message: '网络异常'
				        });
					});
				}else{
					this.$notify.error({
				        title: '错误',
				        message: '两次密码不一致'
				    });
				}
			},
			//添加用户
			toAddUser(){
				this.userDialog.form = {};
				this.userDialog.visible = true;
				this.userDialog.title = "添加用户";
			},
			//显示所有用户
			findAllUsers(){
				let url = '/manager/user/findAllUser';
				axios.get(url).then(({data:result})=>{	
				//data:result  将data重命名为result（data映射到result）
					console.log(result);
					this.users = result.data;
				}).catch((error)=>{
					console.log('error',error);
				});
			}

		}
	}

</script>
<style>
	.opeUser{
		display: inline-block;
		position: absolute;
		right: 0;
		top:0;
		padding: 2px 4px;
		visibility: hidden;
		font-size: 16px;
	}
	.box-card:hover .userFace>.opeUser{
		visibility: visible;
		cursor: pointer;
	}
	.opeUser i.fa-trash{
		color:#F56C6C;	
	}
	.opeUser i.fa-pencil-square{
		color: #006098;
		margin-left: .6em;
	}
	.box-card .userFace {
		position: relative;
	}
	.user{
		overflow: hidden;
	}
	.text {
    	font-size: 14px;
  	}
	.item {
	    margin-bottom: 18px;
	}
  	.clearfix:before,
  	.clearfix:after {
    	display: table;
    	content: "";
  	}
  	.clearfix:after {
    	clear: both
  	}
  	.box-card {
    	width: 345px;
    	float: left;
    	margin: 8px;
  	}
  	.text ul>li{
  		line-height: 32px;
  	}
  	.userFace>img{
  		width: 100px;
  		height: 100px;
  		border-radius: 50%;
  	}
  	.userBtn{
  		margin-left: 9px;
  	}
</style>