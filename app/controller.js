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
		
		$scope.selectModule = function( new_module ) {
			
			if ((new_module == $scope.active_module)) {
				return;
			}
			
			$scope.modules.forEach(function( module ) {
				
				if (new_module == module) {
					$scope.active_module = module;
					$scope.core = cores.loadCore($scope.active_module.core);

					//$scope.apply();
				}
			});
		}
	});
});
