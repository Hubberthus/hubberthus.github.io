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
		
		$scope.cores = cores.loadCores();
		$scope.modules = modules.loadModules();

		$scope.pin_map = new Array($scope.modules[0].pins.length);
		
		var i = 1;
		
		$scope.modules[0].pins.forEach(function( pin ) {
			
			if (pin.number) {
				$scope.pin_map[pin.number] = i;
			}
		
			i++;
		});
	});
});
