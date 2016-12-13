var app = angular.module("mcuSetupApp", []);

app
.controller("mcuSetupController", function( $scope ) {
	
	$scope.cores = [];
	$scope.modules = [];
	
	loadCores($scope);
	loadModules($scope);
})

update = function ( $scope ) {
	
	var center = d3.select("#center");
	
	var image = center.append("center").append("img")
	.attr("src", $scope.modules[0].image)
	.attr("width", "70%");
	
	$scope.modules[0].pins.forEach(function ( pin ) {
		
		center.append("div")
		.attr("style", "position: absolute; left: 0%; top: " + pin.position + "%;")
		.text(pin.number);
	});
}

loadCores = function ( $scope ) {
	
	$.getJSON("/cores/cores.json")
	.done(function( data ) {
		$scope.cores = data;
		$scope.$apply();
	});
}

loadModules = function ( $scope ) {
	
	$.getJSON("/modules/modules.json")
	.done(function( data ) {
		var modules = data;
		
		data.forEach(function( module ) {
			
			$.getJSON("/modules/" + module + "/module.json")
			.done(function( data ) {
				data.image = "/modules/" + module + "/module.png";
				$scope.modules.push(data);
				
				$scope.$apply();
				
				update($scope);
			});
		});
	});
}