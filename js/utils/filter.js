'use strict';
angular.module('modaowang')
	.filter('trustHtml', function($sce) {

		return function(input) {

			return $sce.trustAsHtml(input);
		}
	})
	.filter('pinyinFilter', function() {
		return function(data, keyword) {
			var result = [];
			if(!keyword) {
				return data;
			}
			if(typeof keyword == 'object') {
				for(var key in keyword) {
					if(!keyword[key]) {
						return data;
					} else {
						if(angular.isArray(data)) {
							angular.forEach(data, function(item) {
								if(item[key].indexOf(keyword[key])) {
									result.push(item);
								}
							});
						} else {
							if(item.indexOf(keyword)) {
								result.push(item);
							}
						}
					}
				}
			}
			return result;
		};
	});