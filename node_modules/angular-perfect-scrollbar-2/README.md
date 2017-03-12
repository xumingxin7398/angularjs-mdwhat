# angular-perfect-scrollbar-2
Another wrapper around [perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar).

### Motivation
* No need to include CSS from `node_modules`, it is injected automatically
  (which may cause problems if you need significantly changed version of it, but handy otherwise).
* Simpler configuration interface compared to [angular-perfect-scrollbar](https://github.com/itsdrewmiller/angular-perfect-scrollbar)
  -- you just pass a configuration object, not individual properties.
* A `MutationObserver`, if supported, is used to update a scrollbar.
* Scrollbar can be updated manually when necessary.

### Usage
1. `npm install angular-perfect-scrollbar-2`
2. In app code:
  ```
  angular.module('app', [ require('angular-perfect-scrollbar-2') ])
  ```
  or replace `require()` by `'angular-perfect-scrollbar-2'` and put appropriate `<script src='.../dist/index.js'>` tag in your html.
3. Use `<perfect-scrollbar>` directive in your templates:
```
<style type="text/css">
	.scroll-wrapper {
		position: relative;
		overflow: hidden;
		height: 300px;
	}
</style>

<perfect-scrollbar class="scroll-wrapper" opts="..." update="update">
	... SCROLLABLE CONTENT HERE ...
</perfect-scrollbar>
```

The `opts` attribute allows to configure the perfect-scrollbar instance
(see [perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar)).
For example:
```
// in controller:
$scope.scrollopts = {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

<!-- in template -->
<perfect-scrollbar opts="scrollopts">
	...
</perfect-scrollbar>
```

Or you may pass an object directly within template:
```
<perfect-scrollbar opts="{minScrollBarLength: 20}">
	...
</perfect-scrollbar>
```

The `update` attribute may point to a variable from $scope. Setting this variable to
`true` forces scrollbar update. The variable is set to `false` automatically afterwards.

### Example
A working example can be found in the `example` directory. Just open `index.html` in browser.

### License
MIT
