define(function (require) {

	var $ = require ('jquery');
	var angular = require ('angular');
	var d3 = require ('d3');
	
	var cores = require ('./cores');
	var modules = require ('./modules');
	
	var app = angular.module("mcuSetupApp", []);
	
	app.controller("mcuSetupController", function( $scope ) {
		
		cores.loadCores();
		modules.loadModules();
	})
	
	update = function() {
		
		modules.selectModule(0);
	}
});
