<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <div class="logoDiv">
          <i class="fa fa-500px"></i>
          <span>今日头条精选</span>
        </div>
        <div class="userSign">
          <img :src="user.userface" alt="">
        </div>
        <div class="userInfo">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
               {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="center">
        <div class="left-nav">
          <ul>
            <li :class="{current:currentRoute == '/homepage'}">
              <i class="fa fa-institution"></i>
              <router-link to='/homepage'><span>首页</span></router-link>
              <i class="fa fa-caret-right"></i>
            </li>
            <li :class="{current:currentRoute == '/category'}">
              <i class="fa fa-list"></i>
              <router-link to='/category'><span>栏目管理</span></router-link>
              <i class="fa fa-caret-right"></i>
            </li>
            <li :class="{current:currentRoute == '/article'}">
              <i class="fa fa-book"></i>
              <router-link to='/article'><span>文章管理</span></router-link>
              <i class="fa fa-caret-right"></i>
            </li>
            <li :class="{current:currentRoute == '/user'}">
              <i class="fa fa-users"></i>
              <router-link to='/user'><span>用户管理</span></router-link>
              <i class="fa fa-caret-right"></i>
            </li>
          </ul>
        </div>
        <div class="main-con">
          <div class="content">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/http/axios';
export default {
  data(){
    return {
      currentRoute:'/'
    }
  },
  watch:{
    '$route': function(to,from){
      this.currentRoute = to.path;
    }
  },
  created(){
    let user = JSON.parse(localStorage.getItem('user'));
    if(user&&user.id){
      this.user = user;
    }else{
      window.vm.currentComponent = 'Login';
    }
  },
  methods:{
    handleCommand(command){
      if(command == 'logout'){
        axios.get('/logout').then(( )=>{
          //跳转
          window.vm.currentComponent = 'Login';
          //清理localstorage中的user
          localStorage.removeItem('user');
        });
      }
    } 
  }
}
</script>

<style>
  html {
    font: normal normal 14px '微软雅黑','Microsoft YaHei';
    color: #666
  }
  body , ul ,ol,dl ,p, h1,h2,h3 {
    margin: 0;
    padding: 0
  }
  ul , ol {
    list-style: none;
  }
  a {
    color: #666;
    text-decoration: none;
  }
  div {
    box-sizing: border-box;
  }
  .header {
    position: absolute;
    width: 100%;
    height: 80px;
    top: 0;
    background: #006098;  
    padding: 0 1em; 
  }
  .header .logoDiv>i{
    font-size:36px;
    color: #eee;
    display: inline-block;
    margin-right: 8px;
  }
  .header .logoDiv{
    line-height: 80px;
    margin-left: 8px;
    float: left;
  }
  .header .logoDiv>span{
    font-size: 30px;
    color: #eee;
  }
  .header .userSign{
    float: right;
    z-index: 20;
    margin: 8px;
  }
  .header .userSign>img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .header .userInfo{
    float: right;
    color: #fff;
    line-height: 40px;
    margin-top: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
  .header .userInfo .el-dropdown{
    color: #fff;
  }
  .center {
    position: absolute;
    top: 80px;
    bottom: 0;
    width: 100%;
  }
  .center > .left-nav {
    width: 200px;
    height: 100%;
    float: left;
  }
  .center > .left-nav > ul > li{
    line-height: 2.6em;
    text-align: left;
    padding-left: 60px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    font-size: 16px;
    font-weight: bold;
  }
  .center > .left-nav > ul > li span{
    color: #212322;
  }
  .center > .left-nav > ul > li i.fa {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
    color: #212322;
  }
  .center > .left-nav > ul > li i.fa:last-child {
    right: 1em;
    font-size: 18px;
  }
  .center > .left-nav > ul > li i.fa:first-child {
    left: 1.2em;
    font-size: 16px;
  }
  .center > .left-nav > ul > li.current {
    background-color: #f0efef;
    color: #eee;
  }
  .center > .main-con {
    margin-left: 180px;
    background-color: #f0efef;
    padding: 1em 1em 0 1em;
    height: 100%;
    overflow-y: auto;
    
  }
  .center > .main-con > .content {
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    padding: .8em;
  }  
</style>
