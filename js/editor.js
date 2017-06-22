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
        'app/storage',
        'jquery'], function(app, cores, modules, storage, $) {
	
	// Editor controller function for the AngularJS application	
	app.controller('mcuSetupEditorController',function($scope) {
		
		$scope.mouseX = -1;
		$scope.mouseY = -1;
		$scope.mouseOffsetX = -1;
		$scope.mouseOffsetY = -1;
		
		$scope.active_module = storage.restoreModule();		
		if (! $scope.active_module) {
			$scope.active_module = $scope.modules[0];
		}
		
		$scope.init_module = $scope.modules[0];
		$scope.undo_modules = [];
		$scope.redo_modules = [];
		
		$scope.core = cores.loadCore($scope.active_module.core.name);
		$scope.cores = cores.getCores();
		
		if ($scope.active_module.arrays && $scope.active_module.arrays.length > 0) {
			$scope.active_array = $scope.active_module.arrays[0];
		}
		
		$scope.newArray = function() {
			var array = {
				position: {
					x: 0,
					y: 0
					},
				pitch: 5,
				orientation: "vertical",
				side: "left",
				pins: [Object.keys($scope.active_module.pins)[0]]
				};
			
			$scope.active_module.arrays.push(array);
			$scope.active_array = array;
			$scope.active_pin = null;
			
			$scope.store();
		}
		
		$scope.removeArray = function() {
			
			if (! $scope.active_array) {
				return;
			}
			
			var i = $scope.active_module.arrays.indexOf($scope.active_array);
			$scope.active_module.arrays.splice(i, 1);
			$scope.active_array = null;
			$scope.active_pin = null;
			
			$scope.store();
		}
		
		$scope.setActiveArrayAndPin = function( array, pin ) {
			
			$scope.active_array = array;
			$scope.active_pin = pin;
		}
		
		$scope.setPinNumber = function( value ) {
			
			if (! $scope.active_pin) {
				return;
			}
			
			if ((value - 1) in $scope.core.packages[$scope.active_module.core.package]) {
				$scope.active_module.pins[$scope.active_pin].number = value;
				
				$scope.store();
			}
		}
		
		$scope.moveArrayPositionX = function( value ) {
			
			$scope.active_array.position.x += value;
			
			if ($scope.active_array.position.x < 0) {$scope.active_array.position.x = 0;}
			if ($scope.active_array.position.x > 100) {$scope.active_array.position.x = 100;}
			
			$scope.store();
		}
		
		$scope.moveArrayPositionY = function( value ) {
			
			$scope.active_array.position.y += value;
			
			if ($scope.active_array.position.y < 0) {$scope.active_array.position.y = 0;}
			if ($scope.active_array.position.y > 100) {$scope.active_array.position.y = 100;}
			
			$scope.store();
		}
		
		$scope.moveArrayPitch = function( value ) {
			
			$scope.active_array.pitch += value;
			
			if ($scope.active_array.pitch < 0) {$scope.active_array.pitch = 0;}
			if ($scope.active_array.pitch > 100) {$scope.active_array.pitch = 100;}
			
			$scope.store();
		}
		
		$scope.setArraySide = function( value ) {
			
			$scope.active_array.side = value;
			
			$scope.store();
		}
		
		$scope.setPinInArray = function( index, name ) {
			
			if (name) {
				$scope.active_array.pins[index] = name;
			} else {
				$scope.active_array.pins.splice(index, 1);
			}
			
			$scope.store();
		}
		
		$scope.mouseDown = function( event ) {
			
			if (event.buttons == 1) {
				$scope.mouseOffsetX = $scope.mouseX;
				$scope.mouseOffsetY = $scope.mouseY;
			}
		}
		
		$scope.mouseMove = function( event, array ) {
			
			$scope.mouseX = event.offsetX / document.getElementById('module-image').offsetWidth * 100 - 5;
			$scope.mouseY = event.offsetY / document.getElementById('module-image').offsetHeight * 100 - 5;
			
			if (($scope.active_array == array) && (event.buttons == 1)) {
				if ((Math.abs($scope.mouseX - $scope.mouseOffsetX) > 1) || (Math.abs($scope.mouseY - $scope.mouseOffsetY) > 1)) {
					$scope.moveArrayPositionX($scope.mouseX - $scope.mouseOffsetX);
					$scope.moveArrayPositionY($scope.mouseY - $scope.mouseOffsetY);
				}
			}
		}
		
		$scope.store = function() {
			
			$scope.undo_modules.push($scope.active_module);
			$scope.redo_modules = [];
			
			storage.storeModule($scope.active_module);
		}
		
		$scope.undo = function() {
			
			module = $scope.undo_modules.pop();
			
			if (module) {
				$scope.redo_modules.push(module);
				$scope.active_module = module;
				$scope.core = cores.loadCore($scope.active_module.core.name);
				
				storage.storeModule($scope.active_module);
			}
		}
		
		$scope.redo = function() {
			
			module = $scope.redo_modules.pop();
			
			if (module) {
				$scope.undo_modules.push(module);
				$scope.active_module = module;
				$scope.core = cores.loadCore($scope.active_module.core.name);
				
				storage.storeModule($scope.active_module);
			}
		}

		$scope.reset = function() {
			
			$scope.undo_modules.push($scope.active_module);
			$scope.redo_modules = [];
			
			$scope.active_module = $scope.init_module;
			$scope.core = cores.loadCore($scope.active_module.core.name);
		}
	})
	.directive('editorTopNavbar', function() {
	  return {
		  templateUrl: 'html/editor/top-navbar.html'
	  };
	})
	.directive('editorBottomNavbar', function() {
	  return {
		  templateUrl: 'html/editor/bottom-navbar.html'
	  };
	})
	.directive('editorPins', function() {
	  return {
		  templateUrl: 'html/editor/pins.html'
	  };
	})
	.directive('editorOptionsGeneral', function() {
	  return {
		  templateUrl: 'html/editor/options-general.html'
	  };
	})
	.directive('editorOptionsArray', function() {
	  return {
		  templateUrl: 'html/editor/options-array.html'
	  };
	})
	.directive('editorOptionsPin', function() {
	  return {
		  templateUrl: 'html/editor/options-pin.html'
	  };
	});
});
