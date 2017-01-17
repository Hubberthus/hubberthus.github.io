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
			
			core.peripherals.forEach(function( peripheral ) {
				
				peripheral.active_pins = {};
				
				if( ! peripheral.modes) {
					
					peripheral.modes = {ON: []};
				}

				peripheral.modes.OFF = [];
				
				if( ! peripheral.active_mode) {
					
					peripheral.active_mode = "OFF";
				}

				for (var name in peripheral.pins) {

					peripheral.active_pins[name] = peripheral.pins[name][0];

					if(peripheral.modes.ON) {
					
						peripheral.modes.ON.push(name);
					}
				};
			});
    		
    		return core;
    	}
    };
});
