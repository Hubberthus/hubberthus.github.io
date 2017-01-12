define(function (require) {
	
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

    					module.name = module_dir;
						module.image = "/modules/" + module_dir + "/module.png";
						module_list.push(module);
    				});
    			});
    		});
    		
    		return module_list;
        }
    };
});
