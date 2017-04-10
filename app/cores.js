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

	// Generate default modes "ON" and "OFF" if needed,
	// and set the default pins for every mode on every peripheral
	setupDefaultPeripheralModes = function ( core ) {
		
		core.peripherals.forEach(function( peripheral ) {
			
			peripheral.active_pins = {};
			
			// For empty input create the mode dictionary, initialize with the "ON" mode
			if( ! peripheral.modes) {
				
				peripheral.modes = {ON: []};
			}

			// Add the empty "OFF" mode if not already present
			peripheral.modes.OFF = [];
			
			// Turn off the peripheral by default if no active mode is specified
			if( ! peripheral.active_mode) {
				
				peripheral.active_mode = "OFF";
			}

			// Set default active pins
			for (var name in peripheral.pins) {
				
				// If the pin name is an alias, set its value to the aliased pin
				if (peripheral.pins[peripheral.pins[name][0]]) {
					peripheral.pins[name] = peripheral.pins[peripheral.pins[name][0]];
				}

				// Active pin is the first one in the list
				peripheral.active_pins[name] = peripheral.pins[name][0];

				// Add all pins to the automatically created "ON" mode
				if(peripheral.modes.ON) {
				
					peripheral.modes.ON.push(name);
				}
			};
		});
	}
	
    return {
    	// Returns an initialized core dictionary for the given name
    	loadCore: function ( name ) {
    		
    		core = {};
    		
    		$.getJSON("/cores/" + name + "/info.json")
			.done(function( info ) {
				
				core.info = info;
			});
    		
    		core.active_flavor = null;
			
			$.getJSON("/cores/" + name + "/pinout.json")
			.done(function( pinout ) {
				
				core.pinout = pinout;
			});
			
			$.getJSON("/cores/" + name + "/peripherals.json")
			.done(function( peripherals ) {
				
				core.peripherals = peripherals;
			});
			
			// Load files needed for code generation
			core.source_files = {};

			for(var flavor in core.info.flavors) {
				core.source_files[flavor] = [];
				for(var n in core.info.flavors[flavor]) {
					$.get("/cores/" + name + "/" + flavor + "-flavor/" + core.info.flavors[flavor][n])
					.done(function( file_content ) {
						
						core.source_files[flavor].push({name: core.info.flavors[flavor][n], code: file_content});
					});
				}
			}
			
			setupDefaultPeripheralModes(core);
    		
    		return core;
    	}
    };
});
