<template>
	<!--栏目管理-->
	<div class="category">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size="mini" type="primary" @click="toAddCategory">添加栏目</el-button>
			<el-button size="mini" type="danger" @click="batchDelCategory(multipleSelection)">批量删除</el-button>
		</div>
		<!-- 表格 -->
		<div class="table" v-loading="loading">
			<el-table :data="categories" :border='true' size="small" style="width: 100%"
			@selection-change="handleSelection">
				<el-table-column type="selection" width="55" prop="id">
    			</el-table-column>
			    <el-table-column prop="name" label="栏目" width="180">

			    </el-table-column>
			    <el-table-column prop="parent.name" label="父栏目" width="180">

			    </el-table-column>
			    <el-table-column prop="comment" label="描述">

			    </el-table-column>
			    <el-table-column label="操作" width="100">
			    	<!--作用域插槽-->
			    	<template slot-scope="{row}">
			    		<i class="fa fa-trash" @click="delCategory(row.id)" title="删除"></i>
			    		<i class="fa fa-pencil-square" @click="editCategory(row)" title="修改"></i>   		
			    	</template>
			    </el-table-column>
	    	</el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框开始 -->
		<el-dialog :title="categoryDialog.title" :visible.sync="categoryDialog.visible" 
		 :close-on-click-modal="false">
			<el-form :model="categoryDialog.form">
			    <el-form-item label="栏目名称" label-width="120px">
			      	<el-input v-model="categoryDialog.form.name" autocomplete="off" size="small"></el-input>
			    </el-form-item>
			    <el-form-item label="父栏目" label-width="120px">
				    <el-select v-model="categoryDialog.form.parentId" placeholder="一级栏目" size="small">
				        <el-option v-for="c in categories" :label="c.name" :value="c.id" :key="c.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="栏目描述" label-width="120px">
				    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="categoryDialog.form.comment">
					</el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button size="small" @click="closeCategoryDialog">取 消</el-button>
			    <el-button type="primary" size="small" @click="saveOrUpdateCategory">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
	//@代表src
	import axios from '@/http/axios'  
	export default {
		data(){
			return{
				categories: [],
				loading: false,
				categoryDialog: {
					title: '',
					form: {},
					visible: false,
				},
				multipleSelection: [],
			}
		},
		created(){
			//加载所有栏目信息
			this.findAllCategories();
		},
		methods:{
			//修改
			editCategory(row){
				this.categoryDialog.visible = true;
				this.categoryDialog.title = "修改栏目";
				this.categoryDialog.form = row;
				
			},
			//监听select值的变化
			handleSelection(val) {
		        this.multipleSelection = val;
		    },
		    //批量删除
			batchDelCategory(rows){
				var ids = [];
				rows.forEach(item =>{
			       ids.push(item.id);
			    });
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(()=>{
		        	let url = '/manager/category/batchDeleteCategory';
		        	axios.post(url,{ids:ids}).then(({data:result})=>{
		        		this.$notify({
				          	title: '成功',
				          	message: result.message,
				          	type: 'success'
				        });
				        this.findAllCategories();
		        	}).catch(()=>{
		        		this.$notify.error({
				          	title: '错误',
				          	message: '删除异常'
				        });
		        	});
		        }).catch(()=>{
		        	this.$notify.error({
			          	title: '错误',
			          	message: '网络异常'
			        });
		        });
			},
			//删除
			delCategory(id){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(()=>{
		        	let url = '/manager/category/deleteCategoryById?id='+id;

		        	axios.get(url).then(({data:result})=>{
		        		this.$notify({
				          	title: '成功',
				          	message: result.message,
				          	type: 'success'
				        });
				        this.findAllCategories();
		        	}).catch(()=>{
		        		this.$notify.error({
				          	title: '错误',
				          	message: '删除异常'
				        });
		        	});
		        }).catch(()=>{
		        	this.$notify.error({
			          	title: '错误',
			          	message: '网络异常'
			        });
		        });
			},
			//保存
			saveOrUpdateCategory(){
				let url = '/manager/category/saveOrUpdateCategory';
				axios.post(url,this.categoryDialog.form).then(({data:result})=>{
					if(result.status == 200){
						//关闭模态框
						this.closeCategoryDialog();
						//提示成功信息
						this.$notify({
					        title: '成功',
					        message: result.message,
					        type: 'success'
					    });
					    //刷新数据
					    this.findAllCategories();
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
			},
			//关闭模态框
			closeCategoryDialog(){
				this.categoryDialog.form = {};
				this.categoryDialog.visible = false;
			},
			//添加
			toAddCategory(){
				this.categoryDialog.form = {};
				this.categoryDialog.visible = true;
				this.categoryDialog.title = "添加栏目";
			},
			//查询所有栏目
			findAllCategories(){
				this.loading = true;
				let url = '/manager/category/findAllCategory';
				axios.get(url).then(({data:result})=>{	
				//data:result  将data重命名为result（data映射到result）
					console.log(result);
					this.categories = result.data;
				}).catch((error)=>{
					console.log('error',error);
				}).finally(()=>{
					this.loading = false;
				});
			}
		}
	}
	
</script>
<style scoped>
	.btns{
		margin-bottom: .5em;
	}
	i.fa{
		margin: 0 .5em;
		cursor: pointer;
		font-size: 14px;
	}
	i.fa.fa-trash{
		color: #F56C6C;
	}
	i.fa.fa-pencil-square{
		color: #006098;
	}
</style>