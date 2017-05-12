/* Auto-generated code by MCU pin setup tool */

#ifndef __MPS_H__
#define __MPS_H__

{{#with peripherals.SPI}}
{{#active}}
#include <SPI.h>
{{^options.master.value}}
#include "pins_arduino.h"
{{/options.master.value}}
{{/active}}
{{/with}}
{{#with peripherals.I2C}}
{{#active}}
#include <Wire.h>
{{/active}}

{{/with}}
/* GPIO */
{{#each peripherals.GPIO.active_pins}}
{{#if this}}
#define {{@key}} ({{this}})
{{/if}}
{{/each}}

int digitalRead(uint8_t pin);
void digitalWrite(uint8_t pin, uint8_t val);

/* ADC */
{{#each peripherals.ADC.active_pins}}
{{#if this}}
#define {{@key}} ({{this}})
{{/if}}
{{/each}}

int analogRead(uint8_t pin);

void initializeMPS()
{
	{{#with peripherals.USART}}
	{{#if options.baud.active}}
	Serial.begin({{options.baud.value}});

	{{/if}}
	{{/with}}
	{{#with peripherals.SPI}}
	{{#active}}
	{{#if options.master.value}}
	SPI.begin();
	{{else}}
	// SPI slave startup
	pinMode(MISO, OUTPUT); // set MISO pin as output
	SPCR |= _BV(SPE);      // turn on SPI in slave mode
	SPCR |= _BV(SPIE);     // turn on interrupts
	{{/if}}
	{{/active}}
	{{/with}}
	{{#with peripherals.I2C}}
	{{#active}}
	{{#if options.master.value}}
	Wire.begin();
	{{else}}
	Wire.begin({{options.address.value}});
	Wire.onRequest(i2cRequest);
	Wire.onReceive(i2cReceive);
	{{/if}}

	{{/active}}
	{{/with}}

	{{#each peripherals.GPIO.options}}
	{{#if active}}
	pinMode({{@key}}, {{value}});
	{{/if}}
	{{/each}}
}

#endif /* __MPS_H__ */


