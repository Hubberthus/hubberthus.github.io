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
		$scope.selected_pin = null;
		
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
						
							for (var mode in peripheral.modes) {
								
								peripheral.modes[mode].forEach(function( modePin ) {
									
									var hasPin = false;
									
									peripheral.pins[modePin].forEach(function( pin ) {
										
										if ((pin == null) || (module.pin_map[pin] != undefined)) {

											hasPin = true;
										}
									});
									
									if (!hasPin) {
										
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
		
		$scope.selectPin = function( pin ) {
			
			if ($scope.selected_pin == pin) {
				$scope.selected_pin = null;
			} else {
				$scope.selected_pin = pin;
			}
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
