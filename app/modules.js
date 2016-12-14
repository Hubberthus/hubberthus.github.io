define(function (require) {
	
	var d3 = require ('d3');
	var cores = require ('./cores');
	
	var module_list = [];
	var selected_module = null;
	
    return {
    	loadModules: function () {
    		
    		module_list = [];
    		selected_module = null;
    		
    		$.getJSON("/modules/modules.json")
    		.done(function( module_dir_list ) {
    			module_dir_list.forEach(function( module_dir ) {
    				
    				$.getJSON("/modules/" + module_dir + "/module.json")
    				.done(function( module ) {
    					try {
    					
    						module.image = "/modules/" + module_dir + "/module.png";
	    					module_list.push(module);
	    					
	    					update();
	    					
    					} catch(e) {
    						
    						selected_module = null;
    					}
    				});
    			});
    		});
        },
        
        selectModule: function ( number ) {
        	try {
        		
        		var moduleTag = d3.select("#module");
        		var core;
        		
        		selected_module = module_list[number];
        		
        		core = cores.selectCore(selected_module.core);
        		
        		moduleTag.append("center").append("img")
        		.attr("src", selected_module.image)
        		.attr("width", "70%");
        		
        		selected_module.pins.forEach(function ( pin ) {
        			
        			var corePin = cores.getPin(pin.number);
        			
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
        	
        	} catch(e) {
        		
        		return;
        	}
        }
    };
});
