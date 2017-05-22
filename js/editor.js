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
	
	// Editor controller function for the AngularJS application	
	app.controller('mcuSetupEditorController',function($scope) {
		
		$scope.active_module = $scope.modules[0];
		
		$scope.setActiveArrayAndPin = function( array, pin ) {
			
			$scope.active_array = array;
			$scope.active_pin = pin;
		}
		
		$scope.moveArrayPositionX = function( value ) {
			
			$scope.active_array.position.x += value;
			
			if ($scope.active_array.position.x < 0) {$scope.active_array.position.x = 0;}
			if ($scope.active_array.position.x > 100) {$scope.active_array.position.x = 100;}
		}
		
		$scope.moveArrayPositionY = function( value ) {
			
			$scope.active_array.position.y += value;
			
			if ($scope.active_array.position.y < 0) {$scope.active_array.position.y = 0;}
			if ($scope.active_array.position.y > 100) {$scope.active_array.position.y = 100;}
		}
		
		$scope.moveArrayPitch = function( value ) {
			
			$scope.active_array.pitch += value;
			
			if ($scope.active_array.pitch < 0) {$scope.active_array.pitch = 0;}
			if ($scope.active_array.pitch > 100) {$scope.active_array.pitch = 100;}
		}
		
		$scope.setArraySide = function( value ) {
			
			$scope.active_array.side = value;
		}
		
		$scope.mouseX = -1;
		$scope.mouseY = -1;
		
		$scope.mouseMove = function( event ) {
			
			$scope.mouseX = event.offsetX / document.getElementById('module-image').offsetWidth * 100 - 5;
			$scope.mouseY = event.offsetY / document.getElementById('module-image').offsetHeight * 100 - 5;
		}
	})
	.directive('editorPins', function() {
	  return {
		  templateUrl: 'html/editor/pins.html'
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
