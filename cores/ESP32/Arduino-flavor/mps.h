/* Auto-generated code by MCU pin setup tool */

#ifndef __MPS_H__
#define __MPS_H__

{{#peripherals.VSPI.active}}
#include <SPI.h>
{{^peripherals.VSPI.options.master.value}}
#include "pins_arduino.h"
{{/peripherals.VSPI.options.master.value}}
{{/peripherals.VSPI.active}}
{{#peripherals.I2C0.active}}
#include <Wire.h>
{{/peripherals.I2C0.active}}

void initializeMPS()
{
	{{#peripherals.UART0.active}}
	Serial.begin({{peripherals.UART0.options.baud.value}});

	{{/peripherals.UART0.active}}
	{{#peripherals.UART1.active}}
	Serial1.begin({{peripherals.UART1.options.baud.value}});

	{{/peripherals.UART1.active}}
	{{#peripherals.UART2.active}}
	Serial2.begin({{peripherals.UART2.options.baud.value}});

	{{/peripherals.UART2.active}}
	{{#peripherals.VSPI.active}}
	{{#peripherals.VSPI.options.master.value}}
	SPI.begin();
	{{/peripherals.VSPI.options.master.value}}
	{{^peripherals.VSPI.options.master.value}}
	// SPI slave startup
	// TODO: SPI in slave mode
	{{/peripherals.VSPI.options.master.value}}

	{{/peripherals.VSPI.active}}
	{{#peripherals.I2C0.active}}
	{{#peripherals.I2C0.options.master.value}}
	Wire.begin();
	{{/peripherals.I2C0.options.master.value}}
	{{#peripherals.I2C0.options.address.active}}
	Wire.begin({{peripherals.I2C.options.address.value}});
	Wire.onRequest(i2cRequest);
	Wire.onReceive(i2cReceive);
	{{/peripherals.I2C0.options.address.active}}

	{{/peripherals.I2C0.active}}
}

#endif /* __MPS_H__ */


