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
		
		$scope.height = $(window).height() - 150;
		
		$scope.modules = modules.loadModules();
		
		setActiveModule = function( new_module ) {
			
			if ((new_module == $scope.active_module)) {
				return;
			}
			
			$scope.modules.forEach(function( module ) {
				
				if (new_module == module) {
					$scope.active_module = module;
					$scope.core = cores.loadCore($scope.active_module.core);
					
					$scope.core.peripherals.forEach(function( peripheral ) {
						
						if (peripheral.name != "GPIO") {
						
							for(var mode in peripheral.modes) {
								
								peripheral.modes[mode].forEach(function( modePin ) {

									var active_pin = peripheral.active_pins[modePin];
									
									if((active_pin != null) && (module.pin_map[active_pin] == undefined)) {

										if (peripheral.active_mode == mode) {
											peripheral.active_mode = "OFF";
										}
										
										delete peripheral.modes[mode];
									}
								});
							}
							
							if (Object.keys(peripheral.modes).length == 1) {
								
								peripheral.disabled = true;
							}	
						}
					});
				}
			});
		}
		
		setActiveModule($scope.modules[0]);
		
		$scope.selectModule = function( new_module ) {
			
			setActiveModule(new_module);
		}
	})
	.directive('convertToNumber', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, element, attrs, ngModel) {
	      ngModel.$parsers.push(function(val) {
	        return val != null ? parseInt(val, 10) : null;
	      });
	      ngModel.$formatters.push(function(val) {
	        return val != null ? '' + val : null;
	      });
	    }
	  };
	});
});
