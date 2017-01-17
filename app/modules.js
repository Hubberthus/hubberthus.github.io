define(function (require) {
	
	var module_names = ["ESP-WROOM-32"];
	
	generatePinMap = function ( module ) {
		
		module.pin_map = new Array(module.pins.length);
		
		module.pins.forEach(function( pin ) {

			if (pin.number) {
				module.pin_map[pin.number] = pin.name;
			}
		});
	}
	
    return {
    	loadModules: function () {
    		
    		module_list = [];

    		module_names.forEach(function( name ) {

				$.getJSON("/modules/" + name + "/module.json")
				.done(function( module ) {

					module.image = "/modules/" + name + "/module.png";
					generatePinMap(module);
					module_list.push(module);
				});
			});
    		
    		return module_list;
        }
    };
});
