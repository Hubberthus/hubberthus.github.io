define(function (require) {
	
	var core_list = [];
	var selected_core = null;
	
    return {
    	loadCores: function () {
    		
    		core_list = [];
    		selected_core = null;
    		
    		$.getJSON("/cores/cores.json")
    		.done(function( core_dir_list ) {
    			core_dir_list.forEach(function( core_dir ) {
    				
    				selected_core = { name: core_dir };
    				core_list.push(selected_core);
    				
    				$.getJSON("/cores/" + core_dir + "/pinout.json")
    				.done(function( core_pinout ) {
    					
    					selected_core.pinout = core_pinout;
    				});
    				
    				$.getJSON("/cores/" + core_dir + "/peripherals.json")
    				.done(function( core_peripherals ) {
    					
    					selected_core.peripherals = core_peripherals;
    				});
    			});
    		});
    		
    		return core_list;
    	}
    };
});
