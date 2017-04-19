/* Auto-generated code by MCU pin setup tool */

#include "mps.h"

void setup()
{
	initializeMPS();

	// TODO: Auto-generated code
}

void loop()
{
	// TODO: Auto-generated code
}

{{^peripherals.SPI.options.master.value}}
// SPI interrupt routine
ISR (SPI_STC_vect)
{
	byte input = SPDR; // Store incoming byte

	// TODO: Auto-generated code
}

{{/peripherals.SPI.options.master.value}}
{{#peripherals.I2C.options.address.active}}
// I2C interrupt routines
void i2cRequest(){
	// TODO: Auto-generated code
}

void i2cReceive(int bytesReceived){
	// TODO: Auto-generated code
}

{{/peripherals.I2C.options.address.active}}
