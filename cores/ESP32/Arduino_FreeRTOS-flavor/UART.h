%peripheral%UART0%
/* Auto-generated code by MCU pin setup tool */

#ifndef __UART_H__
#define __UART_H__

#include <stdio.h>

class UARTClass {
	public:

	void begin();
	void end();

	void println(const char *str);
};

extern UARTClass Serial;

#endif /* __UART_H__ */
