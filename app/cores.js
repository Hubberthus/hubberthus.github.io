define(function (require) {
	
	var d3 = require ('d3');
	
	var core_list = [];
	var selected_core = null;
	
    return {
    	loadCores: function () {
    		
    		core_list = [];
    		selected_core = null;
    		
    		$.getJSON("/cores/cores.json")
    		.done(function( data ) {
    			try {
    				
    				core_list = data;
    				selected_core = core_list[0];
    				
    			} catch (e) {
    				
    				selected_core = null;
    			}
    		});
    	},
    	
        selectCore: function ( name ) {
        	
        	var peripheralsTag = d3.select("#peripherals");
        	
        	core_list.forEach(function( core ) {
        		if(core.name == name) {
        			selected_core = core;
        			return;
        		}
        	});
        	
        	selected_core.peripherals.forEach(function ( peripheral ) {
        		
        		peripheralsTag.append("div")
        		.attr("class", "row")
        		.attr("style", "padding: 5px;")
        		.append("div")
        		.attr("style", "width: 50%;"
        				    + "text-align: center;"
        					+ "background: lightblue;"
        					+ "border-radius: 1em;"
        					+ "cursor: pointer;")
        		.text(peripheral.name);
        	});
        	
        	return selected_core;
        },
    	
    	getPin: function ( number ) {
    		
    		try {
    			var retVal = null;
    			
	    		selected_core.pins.forEach(function ( pin ) {
	    			if (pin.number == number) {
	    				retVal = pin;
	    				return;
	    			}
	    		});
	    		
	    		return retVal;
	    		
    		} catch (e) {
    			
    			return null;
    		}
    	}
    };
});
