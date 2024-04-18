#include "stm32f10x.h"                  // Device header
#include "stm32f10x_rcc.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_i2c.h"
#include "stdio.h"
#include "usart2.h"

#include "systick_time.h"


char  data[100];
uint8_t RHI = 50,RHD = 0 , TCI = 40, TCD = 0, lux, fan_h , fan_t;
void EXTI0_Config(void);

void USART2_SendString(uint8_t *str);
void _delay(uint16_t _time);

int main(void){
	EXTI0_Config();
	USART2_Config();
	SystemInit();
	SystemCoreClockUpdate();	
while(1){
	sprintf(data, "%u %u %u %u %u", TCI, RHI, lux, fan_h, fan_t);
	USART2_SendString(data);
	USART2_SendString("\n");
	_delay(1000);
}
}

// truyen UART
void EXTI0_Config(void){
	RCC->APB2ENR |= 0x01;
	AFIO->EXTICR[0] |= 0x01;
	EXTI->PR = 0x01;
	EXTI->RTSR = 0x00;
	EXTI->FTSR |= 0x01;
	EXTI->IMR |= 0x01;
	EXTI->EMR = 0x00;
	EXTI->SWIER |= 0x00;
	NVIC->ISER[0] = 0x40;
}


void _delay(uint16_t _time){
			uint16_t i, j;
		for(i=0;i<_time;i++){
			for(j=0;j<0x2aff;j++);
		}	
}





