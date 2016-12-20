define([
        'app/main',
        'app/cores',
        'app/modules',
        'jquery', 
        'bootstrap'], function(app, cores, modules, $, bootstrap){
	
	app.controller('mcuSetupController',function($scope){
		
		$.ajaxSetup({
		    async: false
		});
		
		cores.loadCores();
		modules.loadModules();
	});
	
	update = function() {
		
		modules.selectModule(0);
	}
});
