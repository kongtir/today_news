<template>
	<div class="article">
		<!-- 按钮 -->
		<div class="btns">
			<el-select :data="categories" v-model="params.categoryId" size="small" placeholder="所有栏目" clearable>
				<!-- @change="selectChange" -->
		      	<el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id"></el-option>
		    </el-select>
			<el-button size="mini" type="primary" @click="toAddArticle">添加文章</el-button>
			<el-button size="mini" type="danger" @click="batchDelArticle">批量删除</el-button>
			<el-input style="width:150px;float=right;" size="small" placeholder="请输入关键字" v-model="params.keywords" clearable>
			</el-input>
		</div>
		<!-- 表格 -->
		<div class="table" v-loading="loading">
			<el-table :data="articles" :border='true' size="small" style="width: 100%" 
			@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
			    <el-table-column prop="title" label="文章标题" width="180">
			    </el-table-column>
			    <el-table-column prop="category.name" label="所属栏目" width="180">
			    </el-table-column>
			    <el-table-column prop="liststyle" label="列表样式">
			    </el-table-column>
			    <el-table-column prop="author" label="作者">
			    </el-table-column>
			    <el-table-column prop="publishtime" label="发布时间">
			    </el-table-column>
			    <el-table-column prop="readtimes" label="阅读次数">
			    </el-table-column>
			    <el-table-column label="操作" width="100">
			    	<!--作用域插槽-->
			    	<template slot-scope="{row}">
			    		<i class="fa fa-trash" title="删除" @click='deleteArticle(row.id)'></i>
			    		<i class="fa fa-pencil-square" title="修改" @click='toUpdateArticle(row)'></i>   		
			    	</template>
			    </el-table-column>
	    	</el-table>
		</div>
		<!-- 表格结束 -->
		<!--分页开始-->
		<div class="artPage" style="margin-left: -8px; margin-top: 8px;" >
			<el-pagination background layout="prev, pager, next" :page-size="params.pageSize"
			 :total="total" @current-change='handleCurrentChange'>
			</el-pagination>
		</div>
		<!--分页结束-->
		<!--模态框开始-->

		<el-dialog :title="articleDialog.title" :visible.sync="articleDialog.visible" fullscreen>
		  	<el-form :model="articleDialog.form">
		    	<el-form-item label="文章标题" label-width="120px">
		      		<el-input size="mini" v-model="articleDialog.form.title" autocomplete="off"></el-input>
		    	</el-form-item>
		    	<el-form-item label="所属栏目" label-width="120px">
		    		<el-select :data="categories" v-model="articleDialog.form.categoryId" size="mini">
		      			<el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id">
		      			</el-option>
		    		</el-select>
		    	</el-form-item>
		    	<el-form-item label="排列样式" label-width="120px">
				    <div class="list_style">
				    	<div :class="{current:articleDialog.form.liststyle=='style-one'}" class="list_one" @click="articleDialog.form.liststyle='style-one'">
				    		<img src="../images/list_one.jpg" alt="">
				    	</div>
				    	<div :class="{current:articleDialog.form.liststyle=='style-two'}" class="list_two" @click="articleDialog.form.liststyle='style-two'">
				    		<img src="../images/list_two.jpg" alt="">
				    	</div>
				    </div>
				</el-form-item>
				<el-form-item label="列表缩略图" label-width="120px">
					<el-upload
					  action="http://106.14.113.36:8099/manager/file/upload"
					  :on-success="handlerUploadSuccess"
					  :on-remove='handleUploadRemove'
					  list-type="picture">
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
		    	<el-form-item label="正文内容" label-width="120px">
		    		<mavon-editor ref=md v-model="articleDialog.form.content"/>
					<!-- <el-input type="textarea" :rows="5" v-model="articleDialog.form.content"></el-input> -->
		    	</el-form-item>
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button size="mini" @click="closeArticleDialog">取 消</el-button>
		    	<el-button type="primary" size="mini" @click="saveOrUpdateArticle">确 定</el-button>
		  	</div>
		</el-dialog>
		<!--模态框结束-->

	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default{
		data(){
			return{
				articles:[],
				categories:[],
				loading: '',
				articleDialog:{
					title: '',
					form: {
						liststyle: 'style-one',
						fileIds: []
					},
					visible: false,
				},
				total:0,
				params:{
					page:0,
					pageSize: 8
				},
				multipleSelection:[]	
			}
		},
		watch:{
			// 只要params中的任意参数发生改变，就要刷新页面
			params:{
				handler:function(){
					this.findArticle();
				},
				deep:true
			}
		},
		created(){
			this.findAllCategories();
			this.findArticle();
		},
		methods:{
			handlerUploadSuccess(response,file,fileList){
				this.articleDialog.form.fileIds.push(response.data.id);
			},
			//删除附件
			handleUploadRemove(file){
				//调用接口删除附件
				axios.get('/manager/file/delete',{
					params:{
						id: file.name
					}
				}).then(()=>{
					this.$notify({title:'成功', message:'操作成功'});
					//从fileIds中移除掉
					_.remove(this.articleDialog.form.fileIds,(ids)=>{
						return id == file.name;
					});
					this.articleDialog.form.fileIds.push(1);
					this.articleDialog.form.fileIds.pop();
				}).catch(()=>{
					this.$notify.error({title:'错误', message:'网络异常'});
				});

			},
			//修改
			toUpdateArticle(row){
				//1.显示模态框
				this.articleDialog.visible = true;
				this.articleDialog.title = '修改文章';
				//2.克隆当前行数据，避免错误修改
				let article = _.cloneDeep(row);
				//3.处理附件默认显示
				this.articleDialog.fileList = article.articleFileVMs.map(item=>{
					return {
						name: item.cmsFile.id,
						url:'http://39.108.81.60:8888/group1/'+item.cmsFile.id
					};
				});
				//处理表单数据
				article.categoryId = article.category.id;
				delete article.category;
				article.fileIds = article.articleFileVMs.map(item=>item.cmsFile.id);
				delete article.articleFileVMs;
				//取消默认控值
				for(let key in article){
					let val = article[key];
					if(!val){
						delete article[key];
					};
				};
				//5.处理后的结果与表单双向绑定
				this.articleDialog.form = article;
			},
			//删除
			deleteArticle(id){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(()=>{
		        	let url = '/manager/article/deleteArticleById?id='+id;
		        	axios.get(url).then(({data:result})=>{
		        		this.$notify({
				          	title: '成功',
				          	message: result.message,
				          	type: 'success'
				        });
				        this.findArticle();
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
			//批量删除
			batchDelArticle(){
				let ids = [];
				this.multipleSelection.map((item)=>{
					ids.push(item.id); 
				});
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(()=>{
		        	let url = '/manager/article/batchDeleteArticle';
		        	axios.post(url,{ids:ids}).then(({data:result})=>{
		        		this.$notify({
				          	title: '成功',
				          	message: result.message,
				          	type: 'success'
				        });
				        this.findArticle();
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
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			//关闭模态框
			closeArticleDialog(){
				this.articleDialog.visible = false;
			},
			//保存或更新信息
			saveOrUpdateArticle(){
				this.articleDialog.form.source = this.$refs.md.d_render;
				let url = '/manager/article/saveOrUpdateArticle';
				axios.post(url,this.articleDialog.form).then(({data:result})=>{
					if(result.status == 200){
						//关闭模态框
						this.closeArticleDialog();
						//提示成功信息
						this.$notify({
					        title: '成功',
					        message: result.message,
					        type: 'success'
					    });
					    //刷新数据
					    this.findArticle();
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
			
			//添加
			toAddArticle(){
				// this.articleDialog.form = {};
				this.articleDialog.form = {
						liststyle:'style-one',
						fileIds:[]
				};
				this.articleDialog.visible = true;
				this.articleDialog.title = "添加文章";
			},
			//监听select值
			/*selectChange(value){
				 this.categoryId = value;
				 this.findArticle(this.categoryId);
			},*/
			handleCurrentChange(page){
				this.params.page = page-1;
			},
			//根据栏目id查找对应文章信息
			findArticle(){
				this.loading = true;
				/*let url = '/manager/article/findArticle?page=0&pageSize=10&categoryId='+this.categoryId;*/
				let url = '/manager/article/findArticle';
				axios.get(url,{
					params:this.params
				}).then(({data:result})=>{	
				//data:result  将data重命名为result（data映射到result）
					console.log(result);
					this.total = result.data.total;
					this.articles = result.data.list;
				}).catch((error)=>{
					console.log('error',error);
				}).finally(()=>{
					this.loading = false;
				});
			},
			//查询所有栏目
			findAllCategories(){
				let url = '/manager/category/findAllCategory';
				axios.get(url).then(({data:result})=>{	
				//data:result  将data重命名为result（data映射到result）
					console.log(result);
					this.categories = result.data;
				}).catch((error)=>{
					this.$notify.error({
				        title: '错误',
				        message: '删除异常'
				    });
				});
			}

		}
	}

	
</script>
<style>
	
	.list_style > div{
		width: 200px;
		height: 86px;
		overflow-y: hidden;
		border: 1px solid #ededed;
		padding: .5em;
		border-radius: 5px;
	}
	.list_style img{
		width: 100%;
	}
	.list_style>div.current{
		border-color: #419fff;
	}
	.list_style > div.list_one{
		float: left;
	}
	.list_style > div.list_two{
		margin-left: 220px;
	}
	.btns{
		margin-bottom: 8px;
		width: 100%;
	}
	.btns .el-select{
		margin-right: 4px;
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
		color: #652f6c;
	}	
</style>