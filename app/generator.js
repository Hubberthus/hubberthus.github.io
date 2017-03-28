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

var IF_REGEX = /([^%]*)%if%([^%]*)%([^%]*)%endif%([^%]*)/mg;

var HEADER_CODE = "/* Auto-generated code by MCU pin setup tool */\n\n" +
		"#ifndef __MPS_H__\n" +
		"#define __MPS_H__\n\n" +
		"/* GPIO */\n\n" +
		"void pinMode(uint8_t pin, uint8_t mode);\n" +
		"void digitalWrite(uint8_t pin, uint8_t val);\n" +
		"int digitalRead(uint8_t pin);\n\n" +
		"%if%(getPeripheral('ADC').active_mode == 'ON')%/* ADC */\n\n" +
		"int analogRead(uint8_t pin);\n\n" +
		"%endif%" +
		"#endif /* __MPS_H__ */\n";

define(['jszip', 'FileSaver'], function (JSZip, FileSaver) {
	
	var core = null;
	
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
		
		var match = IF_REGEX.exec(code);

		while (match != null) {

			code = match[1];
			
			if (eval(match[2])) {
				
				code += match[3];
			}
			
			code += match[4];
			
			match = IF_REGEX.exec(code);
		}
		
		return code;
	}
	
	return {
    	// Generate the code for core with settings and give back to the user as a compressed 'zip' file
    	generateCode: function (in_core) {
    		
    		core = in_core;
    		
    		var zip = new JSZip();
    		
    		file_list = [{name: "mps.h", code: HEADER_CODE}];
    		
    		// Add all sources to the file list
    		for(var n in file_list) {
    			
    			zip.file(file_list[n].name, processCode(file_list[n].code));
    		}
    		
    		// Compress and give back 'zip' file
    		zip.generateAsync({type:"blob"})
    		.then(function(content) {
    		    saveAs(content, "mps.zip");
    		});
        }
    };
});