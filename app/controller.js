/*  "MCU pin setup" website for microcontroller pin layout management. 
    Copyright (C) 2016-2017 Norbert Fekete

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define([
        'app/main',
        'app/cores',
        'app/modules',
        'app/generator',
        'jquery', 
        'bootstrap'], function(app, cores, modules, generator, $, bootstrap){
	
	// Main controller function for the AngularJS application
	app.controller('mcuSetupController',function($scope){
		
		// Disable asyncron AJAX calls so everything can be loaded in order 
		$.ajaxSetup({
		    async: false
		});
		
		$scope.height = $(window).height() - 150; // Needed for scroll panel height 
		$scope.selected_pin = null;               // Used for pin info popup
		
		// Load the list of modules. The loading screen is displayed until this completes
		$scope.modules = modules.loadModules(); 
		
		// Change the module to a new one
		setActiveModule = function( new_module ) {
			
			// Nothing to do if the new module is the same as the active one
			if ((new_module == $scope.active_module)) {
				return;
			}

			$scope.active_module = new_module;
			
			// Reload default core dictionary for the module
			$scope.core = cores.loadCore(new_module.core);
			
			// Update pin availability according to the actual module
			$scope.core.peripherals.forEach(function( peripheral ) {
				
				// For GPIO add the show/hide functionality
				if (peripheral.name == "GPIO") {
					
					peripheral.modes = {"SHOW" : [], "HIDE" : []};
					peripheral.active_mode = "SHOW";
					
					for (var pin in peripheral.pins) {
						peripheral.modes["SHOW"].push(pin);
					}
				
				// For every peripheral check the pin availability
				} else {
					
					var override = false;
					
					// Override peripheral information if provided for the module
					if (new_module.peripherals[peripheral.name]) {
						
						if (new_module.peripherals[peripheral.name].modes) {
							peripheral.modes = new_module.peripherals[peripheral.name].modes;
							override = true;
						}
						
						if (new_module.peripherals[peripheral.name].pins) {
							for (var mode in peripheral.modes) {
								peripheral.modes[mode].forEach(function( modePin ) {
									if (new_module.peripherals[peripheral.name].pins[modePin]) {
										peripheral.pins[modePin] = new_module.peripherals[peripheral.name].pins[modePin];
									}
								});
							}
						}
						
						if (new_module.peripherals[peripheral.name].active_mode) {
							peripheral.active_mode = new_module.peripherals[peripheral.name].active_mode;
						}
					}
				
					// For non-overrided peripherals, check if the pins are routed out
					if ( ! override) {
						
						for (var mode in peripheral.modes) {
							
							peripheral.modes[mode].forEach(function( modePin ) {
								
								var hasPin = false;
								
								// Check pins for the mode
								peripheral.pins[modePin].forEach(function( pin ) {
									
									if ((pin == null) || (new_module.pin_map[pin] != undefined)) {

										hasPin = true;
									}
								});
								
								// If no pin is available delete the mode
								if (!hasPin) {
									
									if (peripheral.active_mode == mode) {
										peripheral.active_mode = "OFF";
									}
									
									delete peripheral.modes[mode];
								}
							});
						}
					}
					
					// If only one mode is left for the peripheral, disable it
					if (Object.keys(peripheral.modes).length == 1) {
						
						peripheral.disabled = true;
					}
				}
				
				// Generate a list of mode names for quick lookup
				peripheral.modenames = [];
				
				for (var modename in peripheral.modes) {
					peripheral.modenames.push(modename);
				}
			});
		}
		
		// Initial module is the first one
		setActiveModule($scope.modules[0]);
		
		/* Exporting functions for AngularJS access */
		
		// Set new active module
		$scope.selectModule = function( new_module ) {
			
			setActiveModule(new_module);
		}
		
		// Set active selected pin. If the same then discard selection.
		$scope.selectPin = function( pin ) {
			
			if ($scope.selected_pin == pin) {
				$scope.selected_pin = null;
			} else {
				$scope.selected_pin = pin;
			}
		}
		
		// Generate the code, and give back as a compressed file
		$scope.generateCode = function() {
			
			generator.generateCode($scope.core);
		}
	})
	// String to integer conversion directive needed by pin selecting dropdown lists
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
