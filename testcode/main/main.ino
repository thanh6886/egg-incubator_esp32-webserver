#include <Wire.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Arduino_JSON.h>
#include <stdio.h>
#include <stdlib.h>

   #define RXD2 16
  #define TXD2 17


#if CONFIG_FREERTOS_UNICORE
static const BaseType_t app_cpu = 0;
#else
static const BaseType_t app_cpu = 1;
#endif


// const char* ssid = "béthu";
// const char* password = "88888888";
const char* ssid = "TP-LINK_E481B4";
const char* password = "94902518";

const char* mqtt_server = "5becba34c368460ba7657c804a6e4eed.s2.eu.hivemq.cloud";
const char* mqtt_username = "bé_thu";
const char* mqtt_password = "Thanh2412";
const int mqtt_port = 8883;

JSONVar data;
WiFiClientSecure esp_client;
PubSubClient client(esp_client);



static const char* root_ca PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";



int temperature , humidity, Light, FAN_A, FAN_B, Motor;

int vri_stt =0 , vri_count = 0;
char buff[100];


TaskHandle_t Task1;  // truyền
TaskHandle_t Task2;  // nhận

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
   Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.println("Initializing...");
    WiFi.begin(ssid, password);
  while (WiFi.status()!= WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Kết nối với mạng Wi-Fi...");
  }
  Serial.println("Đã kết nối với mạng Wi-Fi.");
  WiFi.begin(ssid, password);
  esp_client.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);
  MQTT_Connected();

  xTaskCreatePinnedToCore(SendMQTT, (const char*)"TASK_1", 1024, NULL, 1, &Task1, app_cpu);
  xTaskCreatePinnedToCore(WriteTemp, (const char*)"TASK_2", 1024, NULL, 1, &Task2, app_cpu);
}


void SendMQTT(void *p){
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
            sscanf(buff, "%d-%d-%d-%d-%d-%d", &temperature, &humidity, &Light, &FAN_A, &FAN_B, &Motor);
               data["temperature"] = temperature;
               data["humidity"]    = humidity;
               data["Fan_A"]       = FAN_A;
               data["Fan_B"]       = FAN_B;
               data["light"]       = Light;
               data["motor"]       = Motor;
               String jsonString_2 = JSON.stringify(data);
              Serial.println(jsonString_2);
              client.publish("data", jsonString_2.c_str());
                receviveChar = NULL;
                vri_stt =0;
                vri_count = 0;
                memset(buff, 0, sizeof(buff));
           }
      }
}
void WriteTemp(void *p){
    
}



void MQTT_Connected(){
    while(!client.connected()){
    Serial.println("Attempting MQTT connection...");
    String clientId = "ESPClient";
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Connected.");
      client.subscribe("setTemp");
    } else {
      Serial.println("Try again.");
    }
  }
}




void loop() {
}















