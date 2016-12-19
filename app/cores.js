define(function (require) {
	
	var d3 = require ('d3');
	var setting = require ('./setting');
	
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
        		
        		for (pinFunc in peripheral.pins) {
        			
        			peripheral.pins[pinFunc].forEach(function ( pin ) {
        				
        				setting.setPinFunction(pin, {"name": pinFunc, "color": peripheral.color});
        			});
        		}
        		
        		if (peripheral.name == "GPIO") {
        			return;
        		}
        		
        		var panelTag = peripheralsTag.append("div")
        		.attr("class", "panel");
        		
        		panelTag.append("div")
        		.attr("class", "panel-heading")
        		.attr("style", "background: " + peripheral.color + ";"
        					+ "cursor: pointer;")

        		.append("h5")
        		.attr("class", "panel-title collapsed")
        		.attr("data-toggle", "collapse")
        		.attr("href", "#collapse" + peripheral.name)
        		.attr("aria-expanded", "false")
        		.text(peripheral.name + " ")
        		
        		.append("span")
        		.attr("class", "glyphicon glyphicon-ok")
        		.attr("style", "color: white;"
        					+ " visibility: " + (peripheral.enabled ? "visible" : "hidden") + ";");
        		
        		var contentTag = panelTag.append("div")
        		.attr("class", "panel-collapse collapse")
        		.attr("id", "collapse" + peripheral.name)
        		
        		.append("span")
        		.text(peripheral.description)
        		
        		.append("button")
        		.attr("class", "btn btn-default")
        		.text((peripheral.enabled ? "disable" : "enable"));
        	});
        	
        	return selected_core;
        },
    	
    	getPin: function ( number ) {
    		
    		try {
    			var retVal = null;
    			
	    		selected_core.pinout.forEach(function ( pin ) {
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
