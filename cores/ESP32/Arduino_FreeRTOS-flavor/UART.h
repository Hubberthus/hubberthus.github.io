{{#peripherals.UART0.active}}
/* Auto-generated code by MCU pin setup tool */

#ifndef __UART_H__
#define __UART_H__

#include <stdio.h>

class UARTClass {
	public:

	void begin(int baud);
	void end();

	void println(const char *str);
};

extern UARTClass Serial;

#endif /* __UART_H__ */
{{/peripherals.UART0.active}}
