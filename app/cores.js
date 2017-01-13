define(function (require) {
	
    return {
    	loadCore: function ( name ) {
    		
    		core = {};
			
			$.getJSON("/cores/" + name + "/pinout.json")
			.done(function( pinout ) {
				
				core.pinout = pinout;
			});
			
			$.getJSON("/cores/" + name + "/peripherals.json")
			.done(function( peripherals ) {
				
				core.peripherals = peripherals;
			});
    		
    		return core;
    	}
    };
});
