#ifndef __MPS_H__
#define __MPS_H__

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
{{#peripherals.UART0.active}}
#include "UART.h"
{{/peripherals.UART0.active}}

#ifdef __cplusplus
extern "C" {
#endif

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

extern "C" void app_main()
{
  setup();
}

extern "C" void vApplicationIdleHook()
{
  loop();
}

void initializeMPS()
{
	{{#peripherals.UART0.active}}
	Serial.begin({{peripherals.UART0.options.baud.value}});

	{{/peripherals.UART0.active}}
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
  io_conf.intr_type = (gpio_int_type_t)GPIO_PIN_INTR_DISABLE;
  io_conf.mode = (gpio_mode_t)mode;
  io_conf.pin_bit_mask = (1 << pin);
  io_conf.pull_down_en = (gpio_pulldown_t)0;
  io_conf.pull_up_en = (gpio_pullup_t)0;
  gpio_config(&io_conf);
}

void digitalWrite(uint8_t pin, uint8_t val)
{
  gpio_set_level((gpio_num_t)pin, val);
}

{{#peripherals.ADC.active}}
/* ADC */

int analogRead(uint8_t pin)
{
	return 0;
}

{{/peripherals.ADC.active}}
#ifdef __cplusplus
}
#endif

#endif /* __MPS_H__ */
