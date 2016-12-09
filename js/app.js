var app = angular.module("mcuSetupApp", []); 
app.controller("mcuSetupController", function($scope) {
	
	$scope.cores = [];
	
	$.ajax({
	  url: "/cores/",
	  success: function(data){
	     $(data).find("a:contains(.json)").each(function(){
	        $scope.cores = $(this).attr("href");
	     });
	  }
	});
});
