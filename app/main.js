define(function (require) {

	var $ = require ('jquery');
	var angular = require ('angular');
	var bootstrap = require ('bootstrap');
	var d3 = require ('d3');
	
	var cores = require ('./cores');
	var modules = require ('./modules');
	var setting = require ('./setting');
	
	var app = angular.module("mcuSetupApp", []);
	
	app.controller("mcuSetupController", function( $scope ) {
		
		$.ajaxSetup({
		    async: false
		});
		
		cores.loadCores();
		modules.loadModules();
	})
	
	update = function() {
		
		modules.selectModule(0);
	}
});
