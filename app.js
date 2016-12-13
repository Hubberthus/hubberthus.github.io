var app = angular.module("mcuSetupApp", []);
var activeModule;

app
.controller("mcuSetupController", function( $scope ) {
	
	$scope.cores = [];
	$scope.modules = [];
	
	loadCores($scope);
	loadModules($scope);
})

update = function ( $scope ) {
	
	var moduleTag = d3.select("#module");
	var featuresTag = d3.select("#features");
	var core;
	
	module = $scope.modules[0];
	core = selectCore($scope, module);
	
	moduleTag.append("center").append("img")
	.attr("src", module.image)
	.attr("width", "70%");
	
	module.pins.forEach(function ( pin ) {
		
		var corePin = selectCorePin(core, pin);
		
		moduleTag.append("div")
		.attr("style", "position: absolute;"
					+ "width: 15%;"
				    + "text-align: center;"
					+ "left: " + (pin.side == "left" ? "0" : "85") + "%;"
					+ "top: " + pin.position + "%;"
					+ "background: " + corePin.color + ";"
					+ "border-radius: 1em;"
					+ "cursor: default;")
		.text(corePin.name);
	});
	
	core.features.forEach(function ( feature ) {
		
		featuresTag.append("div")
		.attr("class", "row")
		.attr("style", "padding: 5px;")
		.append("div")
		.attr("style", "width: 50%;"
				    + "text-align: center;"
					+ "background: lightblue;"
					+ "border-radius: 1em;"
					+ "cursor: pointer;")
		.text(feature.name);
	});
}

selectCorePin = function ( core, pin ) {
	
	var retVal = null;
	
	core.pins.forEach(function ( corePin ) {
		if (corePin.number == pin.number) {
			retVal = corePin;
		}
	});
	
	return retVal;
}

selectCore = function ( $scope, module ) {
	
	var retVal = null;
	
	$scope.cores.forEach(function( core ) {
		if(core.name == module.core) {
			retVal = core;
		}
	});
	
	return retVal;
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