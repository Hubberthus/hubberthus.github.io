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

// Setup included libraries and application directory with RequireJS
requirejs.config({
	urlArgs: "bust=" + (new Date()).getTime(), // Avoid caching JavaScript for development
	baseUrl: 'lib',
    paths: {
    	'jquery': 'jquery-3.1.1.min',
    	'angular': 'angular.min',
    	'bootstrap': 'bootstrap.min',
    	'jszip': 'jszip.min',
    	'FileSaver': 'FileSaver.min',
    	'mustache': 'mustache.min',
    	'app': '../app'
    },
    
    shim: {
        'angular': {
            exports: 'angular'
        },
    
    	'bootstrap': {
    		deps: ['jquery']
    	}
    }
});

// Start up AngularJS application using RequireJS
require(['angular', 'app/main', 'app/controller'], function(angular) {
  angular.bootstrap(document, ['app']);
});
