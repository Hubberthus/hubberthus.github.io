/* Auto-generated code by MCU pin setup tool */

#ifndef __MPS_H__
#define __MPS_H__

#include <Arduino_FreeRTOS.h>
%if%(getPeripheral('I2C').active_mode == 'ON')%
#include "I2C.h"
%endif%

#define PRIORITY_LOWEST  (0)
#define PRIORITY_LOW     ((UBaseType_t)(configMAX_PRIORITIES / 4))
#define PRIORITY_NORMAL  ((UBaseType_t)(configMAX_PRIORITIES / 3))
#define PRIORITY_HIGH    ((UBaseType_t)(configMAX_PRIORITIES / 2))
#define PRIORITY_HIGHEST ((UBaseType_t)(configMAX_PRIORITIES - 1))

#define TASK_STACK_MIN   (configMINIMAL_STACK_SIZE)

#define delay(MS) do { vTaskDelay(MS / portTICK_PERIOD_MS); } while(0)

#define task(FUNC) (xTaskCreate(FUNC, #FUNC, TASK_STACK_MIN, NULL, PRIORITY_NORMAL, NULL))

void initializeMPS()
{
	%if%(getPeripheral('USART').active_mode == 'Serial')%
	Serial.begin(115200);
	%endif%
	%if%(getPeripheral('I2C').active_mode == 'ON')%
	I2C.begin();
	%endif%
}

#endif /* __MPS_H__ */
