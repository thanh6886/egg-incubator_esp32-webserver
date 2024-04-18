#include "usart2.h"
#include "stdio.h"
#include "string.h"
#define MAX_STRING_LENGTH 100

char received_string[MAX_STRING_LENGTH];
volatile uint8_t string_received = 0;
/*
	PA2 - TX
	PA3 - RX
*/

void USART2_Config(void)
{
//	// Enable the Alternate Function for PINs
//	RCC->APB2ENR |= 1;
//	// Enable UART2
//	RCC->APB1ENR |=0x20000;
//	// Enable the related PINs
//	RCC->APB2ENR |= (1 << 2);
//	GPIOA->CRL |= 0xB00;
//	// Setup the baude rate for 9600 bps
//	USART2->BRR = 0xEA6; 
//	// Enable Uart Transmit
//	USART2->CR1 |= 8;
//	// Enable Uart Recive
//	USART2->CR1 |= 4;
//	// Enable Uart
//	USART2->CR1 |= 0x2000;
	
	
	//	// Enable the Alternate Function for PINs
	RCC->APB2ENR |= 1; // bat afio
	// Enable UART2
	RCC->APB2ENR |=0x2000;
	// Enable the related PINs
	RCC->APB2ENR |= (1 << 2); // cap a
	GPIOA->CRH |= 0xB00;
	// Setup the baude rate for 9600 bps
	USART1->BRR = 0xEA6; 
	// Enable Uart Transmit
	USART1->CR1 |= 8;
	// Enable Uart Recive
	USART1->CR1 |= 4;
	// Enable Uart
	USART1->CR1 |= 0x2000;
	
	

}

void USART2_SendChar(uint8_t ch)
{
	while((USART1->SR & (1<<6)) == 0x00){};
		USART1->DR = ch;
}

struct __FILE {
    int dummy;
};

void USART2_SendString(uint8_t *str)
{
	while(*str != 0)
	{
		USART2_SendChar(*str++);
	}
}

FILE __stdout;
 
int fputc(int ch, FILE *f) {
	USART2_SendChar(ch);
  return ch;
}


void USART2_ReceiveString(void)
{
    uint8_t index = 0;
    char received_char;

    // Nh?n các ký t? cho d?n khi nh?n du?c ký t? xu?ng dòng ho?c b? d?m d?y
    while (index < MAX_STRING_LENGTH - 1)
    {
        while (USART_GetFlagStatus(USART1, USART_FLAG_RXNE) == RESET); // Ð?i cho d?n khi có d? li?u nh?n du?c
        received_char = USART_ReceiveData(USART1); // Nh?n m?t ký t? t? USART1
        
        if (received_char == '\n' || received_char == '\r')
        {
            received_string[index] = '\0'; // K?t thúc chu?i
            string_received = 1; // Ð?t c? nh?n chu?i
            break;
        }
        received_string[index++] = received_char;
    }
}


// Xu ly ngat nhan 
void USART2_IRQHandler(void)
{
    if (USART_GetITStatus(USART1, USART_IT_RXNE) != RESET)
    {
        static uint8_t index = 0;
        char received_char = USART_ReceiveData(USART1);
        received_string[index++] = received_char;
        if (received_char == '\n' || received_char == '\r' || index >= MAX_STRING_LENGTH - 1)
        {
            received_string[index] = '\0'; // K?t thúc chu?i
            string_received = 1; // Ð?t c? nh?n chu?i
            index = 0; // Ð?t l?i ch? s? cho l?n nh?n ti?p theo
        }
    }
}

