#include <stdio.h>

#include <stdlib.h>
   #define RXD2 16
  #define TXD2 17
char buff[100];
int vri_stt = 0 , vri_count  = 0;
int RHI , TCI , lux, fan_A , fan_B ;


void setup() {

  // put your setup code here, to run once:
      Serial.begin(9600);

    Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
    Serial.println("Serial Txd is on pin: "+String(TX));
    Serial.println("Serial Rxd is on pin: "+String(RX));

}
void loop() {
    while (Serial2.available()) {
      char receviveChar = Serial2.read();
      Serial.print(receviveChar);
          if(receviveChar == '\n'){
                vri_stt = 1;  
          }
          else{
            buff[vri_count] = receviveChar;
            vri_count++;
          }
          if(vri_stt == 1){
            sscanf(buff, "%d-%d-%d-%d-%d", &TCI, &RHI, &lux, &fan_A, &fan_B);
              Serial.println(TCI);
              Serial.println(RHI);
              Serial.println(lux);
              Serial.println(fan_A);
              Serial.println(fan_B);
                receviveChar = NULL;
                vri_stt =0;
                vri_count = 0;
               memset(buff, 0, sizeof(buff));
           }
      }
 
          Serial2.write("ABC\n");
          
          delay(2000);
    
   
}

