'use strict';
angular.module('modaowang')
	.service('appConfig', ['$rootScope', function($rootScope) {
		var appConfig = {
			host: 'localhost',
			//host: '120.24.92.233',
			//host: 'mdwhat.com',
			port: '80',
			appId:'mdwhat.com'
		};
		$rootScope.appConfig = appConfig;
		return appConfig;
	}])
	.service('settings', ['$rootScope', function($rootScope) {

		var settings = {
			layoutHome: {
				sidebar: {
					show: false,
					toggle: function(e) {
						this.show = !this.show;
						if(e){
							e.stopPropagation();
						}
						
					}
				},
				quickBar: {
					show: false,
					toggle: function(e) {
						this.show = !this.show;
						if(e){
							e.stopPropagation();
						}
					}
				},
				headerSearch: {
					open: false,
					show: false,
					toggle: function(e) {
						this.open = !this.open;
						if(e){
							e.stopPropagation();
						}
					}
				},
			},
			layoutForum: {
				quickBar: {
					show: false,
					toggle: function(e) {
						this.show = !this.show;
						if(e){
							e.stopPropagation();
						}
					}
				},
				headerSearch: {
					open: false,
					show: false,
					toggle: function(e) {
						this.open = !this.open;
						if(e){
							e.stopPropagation();
						}
					}
				}
			}
		};

		$rootScope.settings = settings;

		return settings;
	}])
	.config(['$controllerProvider', '$filterProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
		'$compileProvider', '$sceDelegateProvider', '$templateRequestProvider',
		'localStorageServiceProvider', '$ocLazyLoadProvider', '$provide', '$locationProvider',
		function($controllerProvider, $filterProvider, $stateProvider, $urlRouterProvider, $httpProvider,
			$compileProvider, $sceDelegateProvider, $templateRequestProvider,
			localStorageServiceProvider, $ocLazyLoadProvider, $provide, $locationProvider) {
			$provide.decorator('taTranslations', function($delegate) {
				$delegate.heading.tooltip = '字号';
				$delegate.p.tooltip = '段落';
				$delegate.pre.tooltip = '格式';
				$delegate.indent.tooltip = '缩进';
				$delegate.outdent.tooltip = '不缩进';
				$delegate.html.tooltip = '标签/纯文本';
				$delegate.justifyLeft.tooltip = '左对齐';
				$delegate.justifyCenter.tooltip = '居中';
				$delegate.justifyRight.tooltip = '右对齐';
				$delegate.bold.tooltip = '加粗';
				$delegate.italic.tooltip = '斜体';
				$delegate.underline.tooltip = '下划线';
				$delegate.insertLink.tooltip = '插入链接';
				$delegate.insertLink.dialogPrompt = "输入地址";
				$delegate.insertImage.tooltip = '插入图片链接';
				$delegate.insertImage.dialogPrompt = '输入图片地址';
				$delegate.insertVideo.tooltip = '插入视频';
				$delegate.insertVideo.dialogPrompt = '输入youtube视频地址';
				$delegate.clear.tooltip = '清除格式';
				$delegate.charcount.tooltip = '字符数';
				$delegate.wordcount.tooltip = '词数';
				$delegate.redo.tooltip = '重做';
				$delegate.undo.tooltip = '撤回';
				$delegate.ol.tooltip = '有序列表';
				$delegate.ul.tooltip = '无序列表';

				$delegate.editLink.reLinkButton.tooltip = '重新链接';
				$delegate.editLink.unLinkButton.tooltip = '取消链接';
				$delegate.editLink.targetToggle.buttontext = '新窗口打开';
				return $delegate;
			});
			$provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$rootScope', 'taSelection', 'taToolFunctions',
				function(taRegisterTool, taOptions, $rootScope, taSelection, taToolFunctions) { // $delegate is the taOptions we are decorating

					taOptions.toolbar = [
						['bold', 'italics', 'underline', 'h2', 'h4', 'h6'],
						['ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight', 'pre'],
						['html', 'insertLinkC', 'insertImageC', 'insertVideoC'],
						['redo', 'undo', 'clear']
					];
					taRegisterTool('insertLinkC', {
						tooltiptext: '插入链接',
						iconclass: 'fa fa-link',
						action: function(deferred, restoreSelection) {
							var textAngular = this;

							var modal = $rootScope.openContentModal('addLinkModal', '', textAngular);
							modal.result.then(function(result) {
								restoreSelection();
								textAngular.$editor()
									.wrapSelection('createLink', result, true);
								deferred.resolve();
							});
							return false;
						},
						activeState: function(commonElement) {
							if(commonElement) return commonElement[0].tagName === 'A';
							return false;
						},
						onElementSelect: {
							element: 'a',
							action: taToolFunctions.aOnSelectAction
						}

					});

					taRegisterTool('insertImageC', {
						tooltiptext: '插入图片链接',
						iconclass: 'fa fa-picture-o',
						action: function(deferred, restoreSelection) {
							var textAngular = this;

							var modal = $rootScope.openContentModal('addImageModal', '', textAngular);
							modal.result.then(function(result) {
								restoreSelection();
								var embed = '<img src="' + result + '">';
								textAngular.$editor().wrapSelection('insertHTML', embed, true);
								deferred.resolve();

							});
							return false;
						},
						activeState: function(commonElement) {
							if(commonElement) return commonElement[0].tagName === 'A';
							return false;
						},
						onElementSelect: {
							element: 'img',
							action: taToolFunctions.imgOnSelectAction
						}

					});
					taRegisterTool('uploadImage', {
						tooltiptext: '上传图片',
						iconclass: 'glyphicon glyphicon-upload',
						action: function(deferred, restoreSelection) {
							var textAngular = this;
							var modal = $rootScope.openContentModal('uploadImageModal', '', textAngular);
							restoreSelection();
							modal.result.then(function(result) {
								restoreSelection();
								var embed = '<img src="' + result + '">';
								textAngular.$editor().wrapSelection('insertHTML', embed, true);
								deferred.resolve();
							});
							deferred.resolve();
						},
						onElementSelect: {
							element: 'img',
							action: taToolFunctions.imgOnSelectAction
						}
					});

					taRegisterTool('insertVideoC', {
						iconclass: 'fa fa-youtube-play',
						tooltiptext: '插入视频',
						action: function(deferred, restoreSelection) {
							var textAngular = this;
							var modal = $rootScope.openContentModal('addVideoModal', '', textAngular);
							restoreSelection();
							modal.result.then(function(result) {
								restoreSelection();
								var embed = '<embed allowFullScreen="true" quality="high" align="middle" width="360" height="300" src="' + result + '"></embed>';
								textAngular.$editor().wrapSelection('insertHTML', embed, true);
								deferred.resolve();
							});
							deferred.resolve();
						}
					});

					taOptions.toolbar[2].push('uploadImage');

					return taOptions;
				}
			]);

			//请求拦截器和过滤器
			$locationProvider.html5Mode(true);
			$httpProvider.interceptors.push('httpInterceptor');

			$sceDelegateProvider.resourceUrlWhitelist([
				"self",
				"http://localhost:8080/**"
			]);
			$templateRequestProvider.httpOptions({
				headers: {
					"Accept": "text/html"
				}
			});
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

			localStorageServiceProvider.setPrefix('modaowang');

			$stateProvider
			//-------------------首页//
				.state('home', {
				abstract: true,
				url: "/home",
				data: {
					pageTitle: '发现优秀的网站'
				},
				views: {
					'index': {
						templateUrl: "templates/home/layout.html",
						controller: "homeLayoutCtrl"
					}
				},
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([{
								name: 'modaowang',
								files: [

									"js/controller/homeCtrl.js",
									"js/controller/homeLayoutCtrl.js",
									"http://www.baidu.com/js/opensug.js"
								]
							}

						]);
					}]
				}
			})

			.state('home.index', {
					abstract: true,
					url: "/index",
					data: {
						pageTitle: '发现优秀的网站'
					},

					views: {
						'home-content': {
							templateUrl: "templates/home/content.html",
							controller: "homeCtrl"
						}
					},
					cache: true
				})
				.state('home.index.site', {
					deepStateRedirect: {
						default: "home.index.site.common",
						params: true
					},
					sticky: true,
					cache: true,
					url: "/:categoryId",
					data: {
						pageTitle: '发现优秀的网站'
					},

					views: {
						'home-content-site': {
							templateUrl: "templates/home/site-content.html",
							controller: "homeSiteCtrl"
						},
						'home-content-post':{
							templateUrl: "templates/forum/post-page.html",
							controller: "homePostCtrl"
						},

					}

				})
				.state('home.index.site.common', {
					deepStateRedirect: true,
					sticky: true,
					cache: true,
					url: "/common",
					data: {
						pageTitle: '常用网站'
					},
					views: {
						'home-common': {
							templateUrl: "templates/home/header-common.html",
							controller: "homeSiteCommonCtrl"
						}

					}

				})
				.state('home.index.site.favorite', {
					deepStateRedirect: {
						default: "home.index.site.favorite.detail"
					},
					sticky: true,
					cache: true,
					url: "/favorite",
					data: {
						pageTitle: '发现优秀的网站'
					},
					views: {
						'home-favorite': {
							templateUrl: "templates/home/header-favorite.html",
							controller: "homeSiteFavoriteCtrl"
						}
					},
					resolve: {
						favoriteList: function(apiService) {
							
							return apiService.userFavoriteList().then(function(data) {
								if(!data.errCode) {
									return data.data;
								}
								return [];
							});
						}
					}

				})
				.state('home.index.site.favorite.detail', {
					cache: true,
					url: "/:favoriteId",
					data: {
						pageTitle: '收藏详情'
					},
					views: {
						'home-favorite-detail': {
							templateUrl: "templates/home/header-favorite-detail.html",
							controller: "homeSiteFavoriteDetailCtrl"
						}

					}

				})
				.state('home.index.site.tool', {
					deepStateRedirect: true,
					sticky: true,
					cache: true,
					url: "/tool",
					data: {
						pageTitle: '工具大全'
					},
					views: {
						'home-tool': {
							templateUrl: "templates/home/header-tool.html",
							controller: "homeSiteToolCtrl"
						}

					}

				})
				.state('home.index.site.activity', {
					deepStateRedirect: true,
					sticky: true,
					cache: true,
					url: "/activity",
					data: {
						pageTitle: '活动推荐'
					},
					views: {
						'home-activity': {
							templateUrl: "templates/home/header-activity.html",
							controller: "homeSiteActivityCtrl"
						}
					}

				})

			.state('home.index.search', {
				deepStateRedirect: {
					default: "home.index.search.site",
					params: true
				},
				cache: true,
				url: "/search/:keyword",
				data: {
					pageTitle: '搜索结果'
				},
				views: {
					'home-content-site': {
						templateUrl: "templates/home/search.html",
						controller: "homeSearchCtrl"
					}
				}

			})

			.state('home.index.search.site', {
					deepStateRedirect: {
						default: "home.index.search.site.page"
					},
					sticky: true,
					cache: true,
					url: "/site",
					data: {
						pageTitle: '搜索结果'
					},
					views: {
						'home-search-site': {
							templateUrl: "templates/home/search-site.html",
							controller: "homeSearchSiteCtrl"
						}
					}

				})
				.state('home.index.search.site.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '搜索结果'
					},
					views: {
						'home-search-site-page': {
							templateUrl: "templates/home/site-page.html",
							controller: "homeSearchSitePageCtrl"
						}
					}

				})

			.state('home.index.search.post', {
					deepStateRedirect: {
						default: "home.index.search.post.page"
					},
					sticky: true,
					cache: true,
					url: "/post",
					data: {
						pageTitle: '搜索结果'
					},
					views: {
						'home-search-post': {
							templateUrl: "templates/home/search-post.html",
							controller: "homeSearchPostCtrl"
						}
					}

				})
				.state('home.index.search.post.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '搜索结果'
					},
					views: {
						'home-search-post-page': {
							templateUrl: "templates/forum/post-page.html",
							controller: "homeSearchPostPageCtrl"
						}
					}

				})

			//-------------------社区//

			.state('forum', {
					abstract: true,
					cache: true,
					url: "/forum",
					data: {
						pageTitle: '发现优秀的网站'
					},

					views: {
						'index': {
							templateUrl: "templates/forum/layout.html",
							controller: "forumLayoutCtrl"
						}
					},
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'modaowang',
									files: [

										"js/controller/forumCtrl.js",
										"js/controller/forumLayoutCtrl.js",

									]
								}, {
									name: 'ngFileUpload',
									files: [
										"node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js",
										"node_modules/ng-file-upload/dist/ng-file-upload.min.js"

									]
								}

							]);
						}]
					}
				})
				.state('forum.index', {
					deepStateRedirect: {
						default: "forum.index.post"
					},
					abstract: true,
					cache: true,
					url: "/index",
					data: {
						pageTitle: '优秀网站主题社区'
					},

					views: {
						'forum-content': {
							templateUrl: "templates/forum/content.html",
							controller: "forumCtrl"
						}
					}

				})

			.state('forum.index.post', {
					deepStateRedirect: {
						default: "forum.index.post.all",
						params: true
					},
					cache: true,
					url: "/:keyword/:tags",
					data: {
						pageTitle: '优秀网站主题社区'
					},
					views: {
						'forum-content-post': {
							templateUrl: "templates/forum/post-content.html",
							controller: "forumPostCtrl"
						}
					}

				})
				.state('forum.index.post.all', {
					deepStateRedirect: {
						default: "forum.index.post.all.page",
						params: true
					},
					sticky: true,
					cache: true,
					url: "/all",
					data: {
						pageTitle: '优秀网站主题社区'
					},
					views: {
						'forum-post-all': {
							templateUrl: "templates/forum/post-all.html",
							controller: "forumPostAllCtrl"
						}
					}

				})
				.state('forum.index.post.all.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '优秀网站主题社区'
					},
					views: {
						'forum-post-all-page': {
							templateUrl: "templates/forum/post-page.html",
							controller: "forumPostAllPageCtrl"
						}
					}

				})

			.state('forum.index.post.request', {
					deepStateRedirect: {
						default: "forum.index.post.request.page",
						params: true
					},
					sticky: true,
					cache: true,
					url: "/request",
					data: {
						pageTitle: '找网专区'
					},
					views: {
						'forum-post-request': {
							templateUrl: "templates/forum/post-request.html",
							controller: "forumPostRequestCtrl"
						}
					}

				})
				.state('forum.index.post.request.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '找网专区'
					},
					views: {
						'forum-post-request-page': {
							templateUrl: "templates/forum/post-page.html",
							controller: "forumPostRequestPageCtrl"
						}
					}

				})

			.state('forum.index.post.share', {
				deepStateRedirect: {
					default: "forum.index.post.share.page",
					params: true
				},
				sticky: true,
				cache: true,
				url: "/share",
				data: {
					pageTitle: '分享专区'
				},
				views: {
					'forum-post-share': {
						templateUrl: "templates/forum/post-share.html",
						controller: "forumPostShareCtrl"
					}
				}

			})

			.state('forum.index.post.share.page', {

				cache: true,
				url: "/:pageNum",
				data: {
					pageTitle: '分享专区'
				},
				views: {
					'forum-post-share-page': {
						templateUrl: "templates/forum/post-page.html",
						controller: "forumPostSharePageCtrl"
					}
				}

			})

			.state('forum.post-edit', {
				cache: true,
				data: {
					pageTitle: '编辑帖子'
				},
				url: "/post-edit/:postId",
				views: {
					'forum-content': {
						templateUrl: "templates/forum/post-edit.html",
						controller: "postEditCtrl"
					}
				}

			})

			.state('forum.post-detail', {
					deepStateRedirect: {
						default: "forum.post-detail.page",
						params: true

					},
					cache: true,
					url: "/post-detail/:postId",
					data: {
						pageTitle: '帖子详情'
					},
					views: {
						'forum-content': {
							templateUrl: "templates/forum/post-detail.html",
							controller: "postDetailCtrl"
						}
					}

				})
				.state('forum.post-detail.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '帖子详情'
					},
					views: {
						'post-detail-page': {
							templateUrl: "templates/forum/post-detail-page.html",
							controller: "postDetailPageCtrl"
						}
					}

				})
				//------------------------公共//
				.state('public', {
					abstract: true,
					url: "/public",
					data: {
						pageTitle: '发现优秀的网站'
					},

					views: {
						'index': {
							templateUrl: "templates/public/layout.html",
							controller: "publicLayoutCtrl"
						}
					},
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'modaowang',
									files: [

										"js/controller/publicCtrl.js",
										"js/controller/publicLayoutCtrl.js"

									]
								}, {
									name: 'ngFileUpload',
									files: [
										"node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js",
										"node_modules/ng-file-upload/dist/ng-file-upload.min.js"

									]
								}

							]);
						}]
					}
				})
				.state('public.favorite', {
					cache: true,
					url: "/favorite",
					data: {
						pageTitle: '推荐收藏夹'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/favorite.html",
							controller: "publicFavoriteCtrl"
						}
					}

				})
				.state('public.common', {
					cache: true,
					url: "/common",
					data: {
						pageTitle: '推荐常用'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/common.html",
							controller: "publicCommonCtrl"
						}
					}

				})

			.state('public.create-favorite-site', {
				cache: true,
				url: "/create-favorite-site/:site",
				data: {
					pageTitle: '收藏网站'
				},
				views: {
					'public-content': {
						templateUrl: "templates/public/create-favorite-site.html",
						controller: "publicCreateFavoriteSiteCtrl"
					}
				}

			})

			.state('public.user-profile', {
					cache: true,
					url: "/user-profile",
					data: {
						pageTitle: '个人中心'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/user-profile.html",
							controller: "publicUserProfileCtrl"
						}
					},
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([{
									name: 'ngImgCrop',
									files: [
										"js/plugin/ngImgCrop/ng-img-crop.min.css",
										"js/plugin/ngImgCrop/ng-img-crop.min.js"
									]
								}

							]);
						}]
					}

				})
				.state('public.user-profile.prize', {
					deepStateRedirect: {
						default: "public.user-profile.prize.page"
					},
					sticky: true,
					cache: true,
					url: "/prize",
					data: {
						pageTitle: '个人中心-获奖'
					},
					views: {
						'user-profile-prize': {
							templateUrl: "templates/public/user-profile-prize.html",
							controller: "publicUserProfilePrizeCtrl"
						}
					}

				})
				.state('public.user-profile.prize.page', {

					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '个人中心-获奖'
					},
					views: {
						'user-profile-prize-page': {
							templateUrl: "templates/public/prize-page.html",
							controller: "publicUserProfilePrizePageCtrl"
						}
					}

				})
				.state('public.user-profile.post', {
					deepStateRedirect: {
						default: "public.user-profile.post.page"
					},
					sticky: true,
					cache: true,
					url: "/post",
					data: {
						pageTitle: '个人中心-帖子'
					},
					views: {
						'user-profile-post': {
							templateUrl: "templates/public/user-profile-post.html",
							controller: "publicUserProfilePostCtrl"
						}
					}

				})
				.state('public.user-profile.post.page', {

					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '个人中心-帖子'
					},
					views: {
						'user-profile-post-page': {
							templateUrl: "templates/forum/post-page.html",
							controller: "publicUserProfilePostPageCtrl"
						}
					}

				})

			.state('public.ranking', {
					deepStateRedirect: {
						default: "public.ranking.page",
						params: true
					},
					cache: true,
					url: "/ranking/:keyword",
					data: {
						pageTitle: '收藏达人'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/ranking.html",
							controller: "publicRankingCtrl"
						}
					}

				})
				.state('public.ranking.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '收藏达人'
					},
					views: {
						'public-ranking-page': {
							templateUrl: "templates/public/ranking-page.html",
							controller: "publicRankingPageCtrl"
						}
					}

				})
				.state('public.user-zone', {
					deepStateRedirect: {
						default: "public.user-zone.favorite",
						params: true
					},
					cache: true,
					url: "/user-zone/:userId",
					data: {
						pageTitle: '用户空间'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/user-zone.html",
							controller: "publicUserZoneCtrl"
						}
					}

				})
				.state('public.user-zone.favorite', {
					deepStateRedirect: {
						default: "public.user-zone.favorite.detail",
						params: true
					},
					sticky: true,
					cache: true,
					url: "/favorite",
					data: {
						pageTitle: '用户空间'
					},
					views: {
						'user-zone-favorite': {
							templateUrl: "templates/public/user-zone-favorite.html",
							controller: "publicUserZoneFavoriteCtrl"
						}
					},
					resolve: {
						favoriteList: function(apiService, $stateParams) {
							return apiService.userFavoritePublicList({
								ownerId: $stateParams.userId
							}).then(function(data) {
								if(!data.errCode) {
									return data.data;
								}
								return [];
							});
						}
					}

				})
				.state('public.user-zone.favorite.detail', {

					cache: true,
					url: "/:favoriteId",
					data: {
						pageTitle: '用户空间'
					},
					views: {
						'user-zone-favorite-detail': {
							templateUrl: "templates/public/user-zone-favorite-detail.html",
							controller: "publicUserZoneFavoriteDetailCtrl"
						}
					}

				})
				.state('public.user-zone.post', {
					deepStateRedirect: {
						default: "public.user-zone.post.page",
						params: true
					},
					sticky: true,
					cache: true,
					url: "/post",
					data: {
						pageTitle: '用户空间'
					},
					views: {
						'user-zone-post': {
							templateUrl: "templates/public/user-zone-post.html",
							controller: "publicUserZonePostCtrl"
						}
					}

				})
				.state('public.user-zone.post.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '用户空间'
					},
					views: {
						'user-zone-post-page': {
							templateUrl: "templates/forum/post-page.html",
							controller: "publicUserZonePostPageCtrl"
						}
					}

				})
			.state('public.message', {
					deepStateRedirect: {
						default: "public.message.post",
						params: true
					},
					cache: true,
					url: "/message",
					data: {
						pageTitle: '用户消息'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/message.html",
							controller: "publicMessageCtrl"
						}
					}

				})
			.state('public.message.post', {
					deepStateRedirect: {
						default: "public.message.post.page",
						params: true
					},
					cache: true,
					url: "/post",
					data: {
						pageTitle: '用户消息'
					},
					views: {
						'message-post': {
							templateUrl: "templates/public/message-post.html",
							controller: "publicMessagePostCtrl"
						}
					}

				})
				.state('public.message.post.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '用户消息'
					},
					views: {
						'message-post-page': {
							templateUrl: "templates/public/message-post-page.html",
							controller: "publicMessagePostPageCtrl"
						}
					}

				})
				
			.state('public.message.private', {
					deepStateRedirect: {
						default: "public.message.private.page",
						params: true
					},
					cache: true,
					url: "/message-private/:userId/:keyword",
					data: {
						pageTitle: '私信消息'
					},
					views: {
						'message-private': {
							templateUrl: "templates/public/message-private.html",
							controller: "publicMessagePrivateCtrl"
						}
					}

				})
			.state('public.message.private.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '私信消息'
					},
					views: {
						'message-private-page': {
							templateUrl: "templates/public/message-private-page.html",
							controller: "publicMessagePrivatePageCtrl"
						}
					}

				})
			.state('public.user-chat', {
					deepStateRedirect: {
						default: "public.user-chat.page",
						params: true
					},
					cache: true,
					url: "/user-chat/:userId",
					data: {
						pageTitle: '发送私信'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/user-chat.html",
							controller: "publicUserChatCtrl"
						}
					}

				})
			.state('public.user-chat.page', {
					cache: true,
					url: "/:pageNum",
					data: {
						pageTitle: '发送私信'
					},
					views: {
						'user-chat-page': {
							templateUrl: "templates/public/user-chat-page.html",
							controller: "publicUserChatPageCtrl"
						}
					}

				})
			.state('public.score-explain', {
					cache: true,
					url: "/score-explain",
					data: {
						pageTitle: '积分规则说明'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/score-explain.html",
							controller: "publicScoreExplainCtrl"
						}
					}

				})
			
			.state('public.login-redirect', {
					cache: true,
					url: "/login-redirect",
					data: {
						pageTitle: '正在登录'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/login-redirect.html",
							controller: "publicLoginRedirectCtrl"
						}
					}

				})
			
			.state('public.introduce', {
					cache: true,
					url: "/introduce",
					data: {
						pageTitle: '功能介绍'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/introduce.html",
							controller: "publicIntroduceCtrl"
						}
					}

				})
			.state('public.sensitive', {
					cache: true,
					url: "/sensitive/:content",
					data: {
						pageTitle: '敏感内容'
					},
					views: {
						'public-content': {
							templateUrl: "templates/public/sensitive.html",
							controller: "publicSensitiveCtrl"
						}
					}

				})
			;

			$urlRouterProvider.otherwise('/home/index/0/common');
		}
	]);