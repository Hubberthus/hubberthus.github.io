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
        'highlight'], function(app, cores, modules, generator, $, hljs) {
	
	// Main controller function for the AngularJS application	
	app.controller('mcuSetupController',function($scope, $location) {
		
		// Set active page according to URL
		$scope.$on("$locationChangeStart",function(event, next, current) {

			if ($location.protocol().startsWith("file")) {
				$scope.active_page = 'editor';
			} else if ($location.path() == "/about") {
				$scope.active_page = 'about';
			} else if ($location.path()  == "/usage") {
				$scope.active_page = 'usage';
			} else if ($location.path()  == "/layout") {
				$scope.active_page = 'layout';
			} else {
				$scope.active_page = 'select';
			}
		});
		
		// Disable asyncron AJAX calls so everything can be loaded in order 
		$.ajaxSetup({
		    async: false
		});
		
		$scope.INFO    = INFO;
		$scope.WARNING = WARNING;
		$scope.ERROR   = ERROR;
		
		$scope.selected_pin = null;               // Used for pin info popup
		
		// Load the list of modules. The loading screen is displayed until this completes
		$scope.modules = modules.loadModules(); 
		
		// Enable/disable/validate given peripheral and its options
		updatePeripheral = function( peripheral ) {
			
			var core = $scope.core;
			var module = $scope.active_module;
			
			peripheral.active = (peripheral.active_mode != "OFF");
			
			peripheral.valid = true;
			peripheral.message = null;
			
			// Check peripheral validity
			for(validator_name in peripheral.validators) {
				validator = peripheral.validators[validator_name];
				
				if (! eval(validator.check)) {
					
					peripheral.valid = false;
					peripheral.severity = validator.severity;
					peripheral.message = validator.message;
					break;
				}
			}
			
			// Enable/disable options 
			for (name in peripheral.options) {
				
				var option = peripheral.options[name];
				var value = option.value;
				
				option.active = true;
				
				if (option.dependencies) {
					option.dependencies.forEach(function ( dependency ) {
						if (! eval(dependency)) {
							
							option.active = false;
						}
					});
				}
				
				option.valid = true;
				option.message = null;
				
				if (option.validators) {
					for(validator_name in option.validators) {
						validator = option.validators[validator_name];
						
						if (! eval(validator.check)) {
							
							option.valid = false;
							option.severity = validator.severity;
							option.message = validator.message;
							
							// Override peripheral validator severity if needed
							if (peripheral.valid || (peripheral.severity < option.severity)) {
								peripheral.valid = false;
								peripheral.severity = validator.severity;
								peripheral.message = null;
							}
							break;
						}
					}
				}
				
				// Special for options with same name as pins (for GPIO)
				// Enable/disable pins according to options active
				if (peripheral.pins[name]) {
					peripheral.active_pins[name] = (option.active ? peripheral.pins[name][0] : null);
				}
			}
		}
		
		// Enable/disable/validate all peripherals
		updatePeripherals = function() {
			
			// Revalidate all peripherals
			for (name in $scope.core.peripherals) {
				updatePeripheral($scope.core.peripherals[name]);
			}
			
			// Remove GPIO pins used by other peripherals
			for (pin_name in $scope.core.peripherals["GPIO"].pins) {
				
				$scope.core.peripherals["GPIO"].active_pins[pin_name] = $scope.core.peripherals["GPIO"].pins[pin_name][0];
				
				for (name in $scope.core.peripherals) {
					if (name != "GPIO") {
						var active_mode = $scope.core.peripherals[name].active_mode;

						$scope.core.peripherals[name].modes[active_mode].forEach( function( mode_pin_name ) {
							if ($scope.core.peripherals[name].active_pins[mode_pin_name] == $scope.core.peripherals["GPIO"].active_pins[pin_name]) {
								$scope.core.peripherals["GPIO"].active_pins[pin_name] = null;
							}
						});
						if ($scope.core.peripherals["GPIO"].active_pins[pin_name] == null) {
							break
						}
					}
				}
			}
			
			updateCode();
		}
		
		// Update the generated code
		updateCode = function() {
			
			$scope.file_list = generator.generateCode($scope.core);
			
			for (n in $scope.file_list) {
				$scope.file_list[n].code = hljs.highlightAuto($scope.file_list[n].code).value;
			}
			
			// Go to the layout tab if the active file is not in the newly generated code
			if ($scope.active_file) {
				for(n in $scope.file_list) {
					if ($scope.file_list[n].name == $scope.active_file.name) {
						$scope.active_file = $scope.file_list[n];
						return;
					}
				}
			}
			
			$scope.active_file = null;
		}
		
		// Change the module to a new one
		setActiveModule = function( new_module ) {
			
			// Nothing to do if the new module is the same as the active one
			if ((new_module == $scope.active_module)) {
				return;
			}

			$scope.active_module = new_module;
			
			// Reload default core dictionary for the module
			$scope.core = cores.loadCore(new_module.core.name, new_module.core.package);
			
			// Update pin availability according to the actual module
			for (name in $scope.core.peripherals) {
				
				peripheral = $scope.core.peripherals[name];
				
				// For GPIO add the show/hide functionality
				if (name == "GPIO") {
					
					peripheral.modes = {"SHOW" : [], "HIDE" : []};
					peripheral.active_mode = "SHOW";
					
					for (var pin in peripheral.pins) {
						peripheral.modes["SHOW"].push(pin);
					}
				}
				
				// For every peripheral check the pin availability
					
				var override = false;
				
				// Override peripheral information if provided for the module
				if (new_module.peripherals[name]) {
					
					if (new_module.peripherals[name].modes) {
						peripheral.modes = new_module.peripherals[name].modes;
						override = true;
					}
					
					if (new_module.peripherals[name].pins) {
						for (var mode in peripheral.modes) {
							peripheral.modes[mode].forEach(function( modePin ) {
								if (new_module.peripherals[name].pins[modePin]) {
									peripheral.pins[modePin] = new_module.peripherals[name].pins[modePin];
								} else {
									delete peripheral.pins[modePin];
								}
							});
						}
					}
					
					if (new_module.peripherals[name].active_mode) {
						peripheral.active_mode = new_module.peripherals[name].active_mode;
					}
				}
			
				// For non-overrided peripherals, check if the pins are routed out
				if ((name != "GPIO") && ( ! override)) {
					
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
			}
			
			// Revalidate all peripherals
			updatePeripherals();
			
			// Initial code generation
			$scope.file_list = generator.generateCode($scope.core);
			$scope.active_file = $scope.file_list[0];
		}
		
		/* Exporting functions for AngularJS access */
		
		// Set new active module
		$scope.selectModule = function( new_module ) {
			
			if (new_module) {
				setActiveModule(new_module);
				$scope.active_page = 'layout';
			} else {
				$scope.active_module = null;
				$scope.active_page = 'select';
			}
		}
		
		// Enable/disable/validate given peripheral and its options
		$scope.updatePeripherals = function() {
			
			updatePeripherals();
			updateCode();
		}
		
		// Set active selected pin. If the same then discard selection.
		$scope.selectPin = function( pin ) {
			
			if ($scope.selected_pin == pin) {
				$scope.selected_pin = null;
			} else {
				$scope.selected_pin = pin;
			}
		}
		
		// Update the generated code
		$scope.updateCode = function() {
			
			updateCode();
		}
		
		// Set the active file
		$scope.setActiveFile = function( file ) {
			
			$scope.active_file = file;
		}
		
		// Give back the generated code as a compressed file
		$scope.downloadCode = function() {
			
			generator.downloadCode();
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
	})
	.directive('main', function() {
	  return {
		  templateUrl: 'html/main.html'
	  };
	})
	.directive('topNavbar', function() {
	  return {
		  templateUrl: 'html/top-navbar.html'
	  };
	})
	.directive('bottomNavbar', function() {
	  return {
		  templateUrl: 'html/bottom-navbar.html'
	  };
	})
	.directive('about', function() {
	  return {
		  templateUrl: 'html/about/about.html'
	  };
	})
	.directive('usage', function() {
	  return {
		  templateUrl: 'html/usage/usage.html'
	  };
	})
	.directive('select', function() {
	  return {
		  templateUrl: 'html/select/select.html'
	  };
	})
	.directive('layout', function() {
	  return {
		  templateUrl: 'html/layout/layout.html'
	  };
	})
	.directive('layoutPeripheral', function() {
	  return {
		  templateUrl: 'html/layout/peripheral.html'
	  };
	})
	.directive('layoutPeripheralHeader', function() {
	  return {
		  templateUrl: 'html/layout/peripheral-header.html'
	  };
	})
	.directive('layoutPeripheralDescription', function() {
	  return {
		  templateUrl: 'html/layout/peripheral-description.html'
	  };
	})
	.directive('layoutPeripheralPins', function() {
	  return {
		  templateUrl: 'html/layout/peripheral-pins.html'
	  };
	})
	.directive('layoutPeripheralOptions', function() {
	  return {
		  templateUrl: 'html/layout/peripheral-options.html'
	  };
	})
	.directive('layoutInfoPopup', function() {
	  return {
		  templateUrl: 'html/layout/info-popup.html'
	  };
	})
	.directive('layoutPins', function() {
	  return {
		  templateUrl: 'html/layout/pins.html'
	  };
	})
	.directive('editor', function() {
	  return {
		  templateUrl: 'html/editor/editor.html'
	  };
	});
});
