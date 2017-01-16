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
		
		$scope.modules = modules.loadModules();
		$scope.active_module = $scope.modules[0];
		
		$scope.core = cores.loadCore($scope.active_module.core);
		
		$scope.core.peripherals.forEach(function( peripheral ) {
			
			peripheral.active_pins = {};
			
			if( ! peripheral.modes) {
				
				peripheral.modes = {ON: []};
			}

			peripheral.modes.OFF = [];
			
			if( ! peripheral.active_mode) {
				
				peripheral.active_mode = "OFF";
			}

			for (var name in peripheral.pins) {

				peripheral.active_pins[name] = peripheral.pins[name][0];

				if(peripheral.modes.ON) {
				
					peripheral.modes.ON.push(name);
				}
			};
		});
	});
});
