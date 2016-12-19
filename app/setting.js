define(function (require) {
	
	var pinFunctions = [];
	
	return {
		setPinFunction: function( number, func ) {

			while (number > pinFunctions.length) {
				
				pinFunctions.push({"functions" : []});
			}
			
			pinFunctions[number - 1].functions.push(func);
		},
	
		getPinFunctions: function ( number ) {
		
			if (number > pinFunctions.length) {
				return null;
			}
			
			return pinFunctions[number - 1].functions;
		}
	};
});
