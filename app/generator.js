/*  "MCU pin setup" website for microcontroller pin layout management. 
    Copyright (C) 2016-2017 Norbert Fekete

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var PERIPHERAL_REGEX = /%peripheral%([^%]*)%([^%]*)/mg;
var IF_REGEX = /([^%]*)%if%([^%]*)%([^%]*)%endif%([^%]*)/mg;

define(['jszip', 'FileSaver'], function (JSZip, FileSaver) {
	
	var core = null;
	var file_list = [];
	
	// Returns the peripheral dictionary for given name
	getPeripheral = function (name) {
		
		for(var n in core.peripherals) {
			if (core.peripherals[n].name == name) {
				return core.peripherals[n];
			}
		}
		
		return {};
	}
	
	// Preprocess the code
	processCode = function (code) {
		
		PERIPHERAL_REGEX.lastIndex = 0;
		
		var out_code = "";
		var peripheral = PERIPHERAL_REGEX.exec(code);
		
		if (peripheral) {
			if (getPeripheral(peripheral[1]).active_mode != "OFF") {
				out_code = peripheral[2];
			} else {
				return null;
			}
		} else {
			out_code = code;
		}
		
		IF_REGEX.lastIndex = 0;
		
		var match = IF_REGEX.exec(out_code);
		
		if (match == null) {
			return code;
		}
		
		var out_code = "";

		while (match != null) {
			
			out_code += match[1];
			
			if (eval(match[2])) {
				
				out_code += match[3];
			}
			
			out_code += match[4];
			
			match = IF_REGEX.exec(code);
		}
		
		return out_code;
	}
	
	return {
    	// Generate the code for core with settings and give back to the user as a compressed 'zip' file
    	generateCode: function (in_core) {
    		
    		core = in_core;
    		
    		file_list = [];

    		// Process the input files
    		for(var n in core.source_files[core.active_flavor]) {
    			
    			var gen_code = processCode(core.source_files[core.active_flavor][n].code);
    			
    			if (gen_code) {
    				file_list.push({name: core.source_files[core.active_flavor][n].name, code: gen_code});
    			}
    		}
    		
    		return file_list;
        },
        // Give back the code to the user as a compressed 'zip' file
        downloadCode: function () {
        	
            var zip = new JSZip();
    		
    		// Add all sources to the file list
    		for(var n in file_list) {
    			
    			zip.file(file_list[n].name, file_list[n].code);
    		}
    		
    		// Compress and give back 'zip' file
    		zip.generateAsync({type:"blob"})
    		.then(function(content) {
    		    saveAs(content, "mps.zip");
    		});
        }
    };
});