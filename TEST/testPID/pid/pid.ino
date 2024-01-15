


float Kp = 2.0;
float Ki = 0.1;
float Kd = 1.0;

float setPointSenser;

float P_part, I_part, D_part, pre_Error, pre_pre_Error, pre_Out, Out, Error, T;




void PID(){
    P_part = Kp*(Error - pre_Error);
    I_part = 0.5*Ki*T*(Error + pre_Error);
    D_part = Kd/T*( Error - 2*pre_Error+ pre_pre_Error);
    Out = pre_out + P_part + I_part + D_part ;
    pre_pre_Error = pre_Error;
    pre_Error = Error;
    pre_Out = Out;
}

void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:
  
}
