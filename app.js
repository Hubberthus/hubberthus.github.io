requirejs.config({
	baseUrl: 'lib',
    paths: {
    	jquery: 'jquery-3.1.1.min',
    	angular: 'angular.min',
    	d3: 'd3.v4.min',
    	bootstrap: 'bootstrap.min',
    	app: '../app'
    },
    
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});

requirejs(['app/main']);
