const int MOTION_SENSOR_PIN = 2;
const int VIBRATION_SENSOR_PIN = 3;
const int BUZZER_PIN = 4;

int motionValue = 0;
int vibrationValue = 0;

int previousMotionValue = 0;
int previousVibrationValue = 1;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(MOTION_SENSOR_PIN, INPUT);
  pinMode(VIBRATION_SENSOR_PIN, INPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  
  if(Serial.available()> 0) {
    receivingData();
  } else {
    sendingData();
  }

  delay(100);
}

void sendingData() {
  motionValue = digitalRead(MOTION_SENSOR_PIN);
  vibrationValue = digitalRead(VIBRATION_SENSOR_PIN);

  if (previousVibrationValue != vibrationValue) {
    sendSerialMessage(vibrationValue, motionValue);
    previousVibrationValue = vibrationValue;
  }

  if (previousMotionValue != motionValue) {
    sendSerialMessage(vibrationValue, motionValue);
    previousMotionValue = motionValue;
  }

  delay(100);
}

void receivingData() {
  char inByte = Serial.read();

  switch(inByte){
    case 'W':
      tone(BUZZER_PIN, 500);
      delay(100);
      tone(BUZZER_PIN, 1500);
      delay(500);
      noTone(BUZZER_PIN);
      break;
    case 'L':
      tone(BUZZER_PIN, 300);
      delay(400);
      tone(BUZZER_PIN, 250);
      delay(200);
      noTone(BUZZER_PIN);
      break;
  }
  Serial.flush();
}

void sendSerialMessage(int vibrationValue,int motionValue) {
  Serial.print(vibrationValue);
  Serial.print(' ');
  Serial.print(motionValue);
  Serial.print(' ');
  Serial.println();
}
