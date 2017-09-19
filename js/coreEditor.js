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
        'jquery',
        'FileSaver'], function(app, cores, modules, storage, $, FileSaver) {
	
	// Core Editor controller function for the AngularJS application	
	app.controller('mcuSetupCoreEditorController',function($scope) {
		
		$scope.package_types = {
			"DIP": [2, false], "PDIP": [2, false],
			"QFN": [4, true], "TQFN": [4, true],
			"QFP": [4, false], "TQFP": [4, false]};
		
		$scope.active_module = storage.restoreModule();
		if (! $scope.active_module) {
			$scope.active_module = $scope.modules[0];
		}
		$scope.core = cores.loadCore($scope.active_module.core.name);
		$scope.active_pin = null;
		$scope.active_core_pin = null;
		$scope.show_newpackage = false;
		$scope.newpackage_type = null;
		$scope.newpackage_pin_nums = null;
		$scope.newpackage_num = null;
		$scope.side_num = 1;
		
		$scope.init_list = [cores.loadCore($scope.active_module.core.name), $scope.active_pin];
		$scope.undo_list = [];
		$scope.redo_list = [];
		
		$scope.active_package = Object.keys($scope.core.packages)[0];
		$scope.view_mode = "top";
		
		$scope.initSidePinNum = function() {
			
			var type = $scope.active_package.replace(/([^\d]+)\d+/, '$1');

			$scope.side_num = ($scope.core.packages[$scope.active_package].length)
				/ ($scope.package_types[type][0]);
		}
		
		$scope.initSidePinNum();
		
		$scope.setViewMode = function( new_view_mode ) {
			
			$scope.view_mode = new_view_mode;
		}
		
		$scope.setActivePin = function( pin ) {
			
			$scope.active_pin = pin;
			$scope.active_pin_num = $scope.core.packages[$scope.active_package][$scope.active_pin];
		}
		
		$scope.setPinTo = function( pin ) {
			
			$scope.active_pin_num = pin;
			
			$scope.core.packages[$scope.active_package][$scope.active_pin] = pin;
			
			$scope.active_pin = null;
		}
		
		$scope.setActivePackage = function( package ) {
			
			$scope.active_package = package;
			$scope.active_pin = null;
			
			$scope.initSidePinNum();
		}
		
		$scope.setPackageType = function( type ) {
			
			$scope.newpackage_type = type;
			$scope.newpackage_num = null;
			$scope.newpackage_pin_nums = [$scope.package_types[$scope.newpackage_type][0] * 2];		
			
			while(($scope.newpackage_pin_nums[$scope.newpackage_pin_nums.length - 1]
				+ $scope.package_types[$scope.newpackage_type][0]) < $scope.core.pins.length) {
				$scope.newpackage_pin_nums.push($scope.newpackage_pin_nums[$scope.newpackage_pin_nums.length - 1]
					+ $scope.package_types[$scope.newpackage_type][0]);
			}
			
			if ($scope.package_types[$scope.newpackage_type][1]) {
				for (i in $scope.newpackage_pin_nums) {
					$scope.newpackage_pin_nums[i]++;
				}
			}
		}
		
		$scope.setPackagePinNum = function( num ) {
			
			$scope.newpackage_num = num;
		}
		
		$scope.showNewPackage = function () {
			
			$scope.show_newpackage = true;
			$scope.newpackage_type = null;
			$scope.newpackage_pin_nums = null;
			$scope.newpackage_num = null;
		}
		
		$scope.createNewPackage = function () {
			
			var newpackage_name = $scope.newpackage_type
			    + ($scope.newpackage_num - ($scope.package_types[$scope.newpackage_type][1] ? 1 : 0));
			
			$scope.show_newpackage = false;
			$scope.core.packages[newpackage_name] =
				Array.apply(null, {length: $scope.newpackage_num}).map(Number.call, Number);
			$scope.setActivePackage(newpackage_name);
		}
		
		$scope.cancelNewPackage = function () {
			
			$scope.show_newpackage = false;
		}
		
		$scope.removePackage = function () {
			
			if ($scope.active_package) {
				delete $scope.core.packages[$scope.active_package];
				$scope.active_package = null;
			}
		}
		
		$scope.store = function() {
			
			$scope.undo_list.push(JSON.parse(JSON.stringify([$scope.core, $scope.active_pin])));
			$scope.redo_list = [];
			
			storage.storeCore($scope.core);
		}
		
		$scope.undo = function() {
			
			item = $scope.undo_list.pop();

			if (item != undefined) {
				$scope.redo_list.push(JSON.parse(JSON.stringify(item)));
				$scope.core = item[0];
				$scope.active_pin = item[1];
				
				storage.storeCore($scope.core);
			}
		}
		
		$scope.redo = function() {
			
			item = $scope.redo_list.pop();
			
			if (item != undefined) {
				$scope.undo_list.push(JSON.parse(JSON.stringify(item)));
				$scope.core = item[0];
				$scope.active_pin = item[1];
				
				storage.storeCore($scope.core);
			}
		}

		$scope.reset = function() {
			
			$scope.undo_list.push(JSON.parse(JSON.stringify([$scope.core, $scope.active_pin])));
			$scope.redo_list = [];
			
			$scope.core = $scope.init_list[0];
			$scope.active_pin = $scope.init_list[1];
			
			storage.storeCore($scope.active_module);
		}
		
		$scope.export = function() {
			tmp_core = JSON.parse(JSON.stringify($scope.core));
			delete tmp_core["$$hashKey"];
			
			var blob = new Blob([JSON.stringify(tmp_core, null, 2)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "core.json");
		}
	})
	.directive('coreEditorTopNavbar', function() {
	  return {
		  templateUrl: 'html/coreEditor/top-navbar.html'
	  };
	})
	.directive('coreEditorBottomNavbar', function() {
	  return {
		  templateUrl: 'html/coreEditor/bottom-navbar.html'
	  };
	})
	.directive('coreEditorPins', function() {
	  return {
		  templateUrl: 'html/coreEditor/pins.html'
	  };
	})
	.directive('coreEditorOptionsGeneral', function() {
	  return {
		  templateUrl: 'html/coreEditor/options-general.html'
	  };
	})
	.directive('coreEditorOptionsPins', function() {
	  return {
		  templateUrl: 'html/coreEditor/options-pins.html'
	  };
	});
});
