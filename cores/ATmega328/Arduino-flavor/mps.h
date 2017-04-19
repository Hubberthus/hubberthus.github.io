/* Auto-generated code by MCU pin setup tool */

#ifndef __MPS_H__
#define __MPS_H__

{{#peripherals.SPI.active}}
#include <SPI.h>
{{^peripherals.SPI.options.master.value}}
#include "pins_arduino.h"
{{/peripherals.SPI.options.master.value}}
{{/peripherals.SPI.active}}
{{#peripherals.I2C.active}}
#include <Wire.h>
{{/peripherals.I2C.active}}

void initializeMPS()
{
	{{#peripherals.USART.options.baud.active}}
	Serial.begin({{peripherals.USART.options.baud.value}});

	{{/peripherals.USART.options.baud.active}}
	{{#peripherals.SPI.active}}
	{{#peripherals.SPI.options.master.value}}
	SPI.begin();
	{{/peripherals.SPI.options.master.value}}
	{{^peripherals.SPI.options.master.value}}
	// SPI slave startup
	pinMode(MISO, OUTPUT); // set MISO pin as output
	SPCR |= _BV(SPE);      // turn on SPI in slave mode
	SPCR |= _BV(SPIE);     // turn on interrupts
	{{/peripherals.SPI.options.master.value}}

	{{/peripherals.SPI.active}}
	{{#peripherals.I2C.active}}
	{{#peripherals.I2C.options.master.value}}
	Wire.begin();
	{{/peripherals.I2C.options.master.value}}
	{{#peripherals.I2C.options.address.active}}
	Wire.begin({{peripherals.I2C.options.address.value}});
	Wire.onRequest(i2cRequest);
	Wire.onReceive(i2cReceive);
	{{/peripherals.I2C.options.address.active}}

	{{/peripherals.I2C.active}}
}

#endif /* __MPS_H__ */


