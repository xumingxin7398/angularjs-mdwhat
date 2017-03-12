angular-pinyin-translate
================

> 把中文转换成拼音的插件.

- [Installation](#installation)
- [Usage](#usage)

# Installation

1.使用bower来安装:
```bash
bower install angular-pinyin-translate --save
```

2.注入js到index.html:
```html
<script src="lib/angular-pinyin-translate/dist/angular-pinyin-translate.js"></script>
```

3.把 `angular-pinyin-translate` 模块加到你的app模块中
```javascript
angular.module('app', [
  'ionic',
  'angular-pinyin-translate'
]);
```

# Usage

把`$pinyinTranslate` 模块inject到你需要使用的控制器或者服务中。
#Example
```javascript
var pinyin1 = $pinyinTranslate.getFullChars("张三");
var pinyin2 = $pinyinTranslate.getCamelChars("张三");
//pinyin1:ZhangSan
//pinyin2:ZS
```
