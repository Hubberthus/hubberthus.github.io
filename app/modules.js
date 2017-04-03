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

define(function (require) {
	
	// List of the selectable modules. If a new one is added, it must be in this list
	var module_names = ["Arduino_Pro_Mini", "ESP-WROOM-32", "SparkFun_ESP32_Thing"];
	
	// Generate a pin number to pin name array for quick lookup
	generatePinMap = function ( module ) {
		
		module.pin_map = new Array(module.pins.length);
		
		module.pins.forEach(function( pin ) {

			if (pin.number) {
				module.pin_map[pin.number] = pin.name;
			}
		});
	}
	
    return {
    	// Returns a list containing every module dictionary
    	loadModules: function () {
    		
    		module_list = [];

    		module_names.forEach(function( name ) {

				$.getJSON("/modules/" + name + "/module.json")
				.done(function( module ) {

					module.image = "/modules/" + name + "/module.png";
					
					generatePinMap(module);
					
					// Create empty peripheral override list if not set
					if (! module.peripherals) {
						module.peripherals = [];
					}
					
					module_list.push(module);
				});
			});
    		
    		return module_list;
        }
    };
});
