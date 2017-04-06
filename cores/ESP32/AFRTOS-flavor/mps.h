#ifndef __MPS_H__
#define __MPS_H__

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"

#define PRIORITY_LOWEST  (0)
#define PRIORITY_LOW     ((UBaseType_t)(configMAX_PRIORITIES / 4))
#define PRIORITY_NORMAL  ((UBaseType_t)(configMAX_PRIORITIES / 3))
#define PRIORITY_HIGH    ((UBaseType_t)(configMAX_PRIORITIES / 2))
#define PRIORITY_HIGHEST ((UBaseType_t)(configMAX_PRIORITIES - 1))

#define TASK_STACK_MIN   (configMINIMAL_STACK_SIZE)

#define delay(MS) do { vTaskDelay(MS / portTICK_PERIOD_MS); } while(0)

#define task(FUNC) (xTaskCreate(FUNC, #FUNC, TASK_STACK_MIN, NULL, PRIORITY_NORMAL, NULL))

void setup();
void loop();

void app_main()
{
  setup();
}

void vApplicationIdleHook()
{
  loop();
}

void initializeMPS()
{
}

/* GPIO */

#define INPUT  GPIO_MODE_INPUT
#define OUTPUT GPIO_MODE_OUTPUT

#define LOW  0
#define HIGH 1

#define LED_BUILTIN 5
#define BUILTIN_LED 5

void pinMode(uint8_t pin, uint8_t mode)
{
  gpio_config_t io_conf;
  io_conf.intr_type = GPIO_PIN_INTR_DISABLE;
  io_conf.mode = mode;
  io_conf.pin_bit_mask = (1 << pin);
  io_conf.pull_down_en = 0;
  io_conf.pull_up_en = 0;
  gpio_config(&io_conf);
}

void digitalWrite(uint8_t pin, uint8_t val)
{
  gpio_set_level(pin, val);
}

%if%(getPeripheral('ADC').active_mode == 'ON')%
/* ADC */

int analogRead(uint8_t pin)
{
	// TODO: Code something
}

%endif%

#endif /* __MPS_H__ */
