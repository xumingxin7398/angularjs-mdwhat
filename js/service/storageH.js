'use strict';
angular.module('modaowang')
	.service('storageH', function($window, $rootScope,localStorageService) {
		var userKey="User";
		this.getObj = function(name) {
			return localStorageService.get(name);
		};
		this.removeObj=function(name){
			localStorageService.remove(name);
		};
		this.setObj = function(name, obj) {
			localStorageService.set(name, obj);
		};

		//获取当前登录用户信息
		this.getUser = function() {
			if($rootScope.modaowangUser&&$rootScope.modaowangUser.token) {
				return $rootScope.modaowangUser;
			} else if(this.getObj(userKey)&&this.getObj(userKey).token) {
				$rootScope.modaowangUser=this.getObj(userKey);
				return $rootScope.modaowangUser;
			} else {
				$rootScope.openLoginModal();
				return this.initUser();
			}
		};
		this.getUserInfo=function(){
			if($rootScope.modaowangUser&&$rootScope.modaowangUser.token) {
				return $rootScope.modaowangUser;
			} else if(this.getObj(userKey)&&this.getObj(userKey).token) {
				return this.getObj(userKey);
			}
			return null;
		};
		this.initUser = function() {
			if(this.getObj(userKey)) {
				return this.getObj(userKey);
			} else {
				return {
					token:"",
					user:{
						id:"",
						userName: "",
						inputPassword: "",
						password:"",
					}
				};
			}
		};
		//获取当前登录用户信息
		this.setUser = function(user) {
			$rootScope.modaowangUser = user;
			this.setObj(userKey, user);
		};
		
		this.removeUser=function(){
			if($rootScope.modaowangUser){
				$rootScope.modaowangUser.token="";
				this.setUser($rootScope.modaowangUser);
			}else if(this.getObj(userKey)){
				this.getObj(userKey).token="";
				this.setUser($rootScope.modaowangUser);
			}
		};


		

	});