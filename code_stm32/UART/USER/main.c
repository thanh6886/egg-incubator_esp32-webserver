#include "stm32f10x.h"                 
#include "stm32f10x_gpio.h"             // Keil::Device:StdPeriph Drivers:GPIO
#include "stm32f10x_rcc.h"              // Keil::Device:StdPeriph Drivers:RCC
#include "string.h"
#include "stdio.h"
#include <stdlib.h>
#include <time.h>

void uart_Init(void);
void uart_SendChar(char _chr);
void uart_SendStr(char *str);
void Delay_ms(uint16_t _time);
char 	vrc_Getc , vri_stt = 0;
char vrc_res[100];
int vri_count = 0;

char  data[100];
int R = 10  , T = 10 , lux = 1, fan_A  = 1, fan_B = 1, motor = 1;


int main(){
	uart_Init();
	
	while(1){
		for(T=0;T<1000;T++){
			
		sprintf(data, "%d-%d-%d-%d-%d-%d\n", T, T, lux, fan_A, fan_B, motor);
		uart_SendStr(data);
		Delay_ms(1000);	
		}
	}
}

void Delay_ms(uint16_t _time){
	uint16_t i,j;
	for(i = 0; i < _time; i++){
		for(j = 0; j < 0x2AFF; j++);
	}
}




void uart_SendChar(char _chr){
	USART_SendData(USART1,_chr);
	while(USART_GetFlagStatus(USART1, USART_FLAG_TXE)==RESET);
}

void uart_SendStr(char *str){
	while(*str != NULL){
		uart_SendChar(*str++);		
	}
}

// uart nhân data

uint16_t UARTx_Getc(USART_TypeDef* USARTx){
	return USART_ReceiveData(USARTx);
}

void USART1_IRQHandler(void) {
 if (USART_GetITStatus(USART1, USART_IT_RXNE) != RESET) {
        vrc_Getc  =    UARTx_Getc(USART1);	
				if(vrc_Getc == 'T'){
					vri_stt = 1;
				}
				if(vrc_Getc == 'M'){
					vri_stt = 2;
				}
				else{
					vrc_res[vri_count] = vrc_Getc;
					vri_count++;
				}
				if(vri_stt == 1){
					uart_SendStr(vrc_res);
					vrc_res[vri_count] = NULL;
					vri_count = 0;
					vri_stt = 0;
				}
				if(vri_stt == 2){
					uart_SendStr(vrc_res);
					vrc_res[vri_count] = NULL;
					vri_count = 0;
					vri_stt = 0;
				}
				
		}
 }





void uart_Init(void){
	GPIO_InitTypeDef gpio_typedef;
	USART_InitTypeDef usart_typedef;
	// enable clock
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_USART1, ENABLE);
	// congifgure pin Tx - A9;
	gpio_typedef.GPIO_Pin = GPIO_Pin_9;
	gpio_typedef.GPIO_Mode = GPIO_Mode_AF_PP;
	gpio_typedef.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA,&gpio_typedef);	
	// configure pin Rx - A10;
	gpio_typedef.GPIO_Pin = GPIO_Pin_10;
	gpio_typedef.GPIO_Mode = GPIO_Mode_IN_FLOATING;
	gpio_typedef.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA,&gpio_typedef);
	// usart configure
	usart_typedef.USART_BaudRate = 9600;
	usart_typedef.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
	usart_typedef.USART_Mode = USART_Mode_Tx | USART_Mode_Rx; 
	usart_typedef.USART_Parity = USART_Parity_No;
	usart_typedef.USART_StopBits = USART_StopBits_1;
	usart_typedef.USART_WordLength = USART_WordLength_8b;
	USART_Init(USART1, &usart_typedef);
	
	USART_ITConfig(USART1, USART_IT_RXNE, ENABLE);
	NVIC_EnableIRQ(USART1_IRQn);
	USART_Cmd(USART1, ENABLE);
}
