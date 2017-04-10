/* Auto-generated code by MCU pin setup tool */

#ifndef __MPS_H__
#define __MPS_H__

%if%(getPeripheral('I2C').active_mode == 'ON')%
#include "I2C.h"
%endif%
%if%(getPeripheral('SPI').active_mode == 'ON')%
#include "SPI.h"
%endif%

void initializeMPS()
{
	%if%(getPeripheral('USART').active_mode == 'Serial')%
	Serial.begin(115200);
	%endif%
	%if%(getPeripheral('I2C').active_mode == 'ON')%
	I2C.begin();
	%endif%
	%if%(getPeripheral('SPI').active_mode == 'ON')%
	SPI.begin();
	%endif%
}

#endif /* __MPS_H__ */


