define(function (require) {
	
	var d3 = require ('d3');
	var cores = require ('./cores');
	var setting = require ('./setting');
	
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

    					module.name = module_dir;
						module.image = "/modules/" + module_dir + "/module.png";
						module_list.push(module);
    					
    					update();
    				});
    			});
    		});
        },
        
        selectModule: function ( number ) {
        	try {
        		
        		var moduleTag = d3.select("#module");
        		
        		selected_module = module_list[number];
        		
        		cores.selectCore(selected_module.core);
        		
        		moduleTag.append("center").append("img")
        		.attr("src", selected_module.image)
        		.attr("width", "70%");
        		
        		selected_module.pins.forEach(function ( pin ) {
      			
        			if (pin.name) {
        				
        				moduleTag.append("div")
        				.attr("class", "label-pin-" + pin.side)
        				.attr("style", "top: " + pin.position + "%;")
        				.append("div")
        				.attr("class", "label")
        				.attr("style", "width: 100%;"
        							+ "background: " + pin.color + ";")
        				.text(pin.name);
        				return;
        			}
        			
    				var pinFuncList = setting.getPinFunctions(pin.number);
    				
    				if (pinFuncList != null && pinFuncList.length > 0) {
    					
    					var pinTag = moduleTag.append("div")
    					.attr("class", "label-pin-" + pin.side)
        				.attr("style", "top: " + pin.position + "%;");
    					
    					pinFuncList.forEach(function ( pinFunc ) {
    						pinTag.append("div")
    						.attr("class", "label")
	        				.attr("style", "width: " + (100.0/pinFuncList.length) + "%;"
	        						+ "background: " + pinFunc.color + ";")
	        				.text(pinFunc.name);
    					});
    				} else {
    					
    					moduleTag.append("div")
        				.attr("class", "label-pin-" + pin.side)
        				.attr("style", "top: " + pin.position + "%;")
        				.append("div")
        				.attr("class", "label")
        				.attr("style", "width: 100%;"
        						+ "background: " + pin.color + ";")
        				.text(cores.getPin(pin.number).name);
    				}
        		});
        	
        	} catch(e) {
        		return;
        	}
        }
    };
});
