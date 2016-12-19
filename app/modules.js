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

        			//var pinName = pin.name;
        			
        			//var pinTag = moduleTag.append("div");
      			
        			if (pin.name) {
        				
        				moduleTag.append("div")
        				.attr("style", "position: absolute;"
        						+ "width: 15%;"
        						+ "text-align: center;"
        						+ "left: " + (pin.side == "left" ? "0" : "85") + "%;"
        						+ "top: " + pin.position + "%;"
        						+ "background: " +pin.color + ";"
        						+ "border-radius: 1em;"
        						+ "cursor: default;")
        				.text(pin.name);
        				return;
        			}
        			
    				var pinFuncList = setting.getPinFunctions(pin.number);
    				
    				if (pinFuncList != null && pinFuncList.length > 0) {
    					
    					var pinTag = moduleTag.append("div")
        				.attr("style", "position: absolute;"
        						+ "width: 15%;"
        						+ "text-align: center;"
        						+ "left: " + (pin.side == "left" ? "0" : "85") + "%;"
        						+ "top: " + pin.position + "%;"
        						+ "border-radius: 1em;"
        						+ "cursor: default;");
    					
    					pinFuncList.forEach(function ( pinFunc ) {
    						pinTag.append("div")
	        				.attr("style", "width: " + (100.0/pinFuncList.length) + "%;"
	        						+ "display: inline-block;"
	        						+ "background: " +pinFunc.color + ";"
	        						+ "border-radius: 1em;")
	        				.text(pinFunc.name);
    					});
    				} else {
    					
    					moduleTag.append("div")
        				.attr("style", "position: absolute;"
        						+ "width: 15%;"
        						+ "text-align: center;"
        						+ "left: " + (pin.side == "left" ? "0" : "85") + "%;"
        						+ "top: " + pin.position + "%;"
        						+ "background: " +pin.color + ";"
        						+ "border-radius: 1em;"
        						+ "cursor: default;")
        				.text(cores.getPin(pin.number).name);
    				}
        		});
        	
        	} catch(e) {
        		
        		return;
        	}
        }
    };
});
