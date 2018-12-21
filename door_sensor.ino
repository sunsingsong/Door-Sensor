/*  NETPIE ESP8266 basic sample                            */
/*  More information visit : https://netpie.io             */

#include <ESP8266WiFi.h>
#include <MicroGear.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(13,15); // RX, TX
 
const char* ssid     = "Xperia XZ Premium_5938";
const char* password = "singsong555";

#define APPID   "EmbeddedLabFinalProject"
#define KEY     "Ks0tJdF0yzZaTMS"
#define SECRET  "8kcOaB5T4R2c4tTzxcuwpNOgA"
#define ALIAS   "esp8266"

WiFiClient client;

int timer = 0;
int b = 0;
MicroGear microgear(client);

/* If a new message arrives, do this */
void onMsghandler(char *topic, uint8_t* msg, unsigned int msglen) {
    Serial.print("Incoming message --> ");
    msg[msglen] = '\0';
    Serial.println((char *)msg);
    if(msg[0]=='O' && msg[1]=='N'){
      Serial.println("Turn on sensor");
      mySerial.write("1");
      microgear.chat("my_server","ON");
    }
    if(msg[0]=='O' && msg[1]=='F' && msg[2]=='F'){
      Serial.println("Turn off sensor");
      mySerial.write("0");
      microgear.chat("my_server","OFF");
    }
    if(msg[0]=='C' && msg[1]=='L' && msg[2]=='O' && msg[3]=='S' && msg[4]=='E'){
      Serial.println("Close...");
      mySerial.write("2");
      microgear.chat("my_server","CLOSE");
    }
    //Serial.println((char *)msg);
}

void onFoundgear(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.print("Found new member --> ");
    for (int i=0; i<msglen; i++)
        Serial.print((char)msg[i]);
    Serial.println();  
}

void onLostgear(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.print("Lost member --> ");
    for (int i=0; i<msglen; i++)
        Serial.print((char)msg[i]);
    Serial.println();
}

/* When a microgear is connected, do this */
void onConnected(char *attribute, uint8_t* msg, unsigned int msglen) {
    Serial.println("Connected to NETPIE...");
    /* Set the alias of this microgear ALIAS */
    microgear.setAlias(ALIAS);
}


void setup() {
    
    /* Add Event listeners */
    /* Call onMsghandler() when new message arraives */
    microgear.on(MESSAGE,onMsghandler);

    /* Call onFoundgear() when new gear appear */
    microgear.on(PRESENT,onFoundgear);

    /* Call onLostgear() when some gear goes offline */
    microgear.on(ABSENT,onLostgear);

    /* Call onConnected() when NETPIE connection is established */
    microgear.on(CONNECTED,onConnected);

    Serial.begin(115200);
    mySerial.begin(115200);
    Serial.println("Starting...");

    /* Initial WIFI, this is just a basic method to configure WIFI on ESP8266.                       */
    /* You may want to use other method that is more complicated, but provide better user experience */
    if (WiFi.begin(ssid, password)) {
        while (WiFi.status() != WL_CONNECTED) {
            delay(500);
            Serial.print(".");
        }
    }

    Serial.println("WiFi connected");  
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    /* Initial with KEY, SECRET and also set the ALIAS here */
    microgear.init(KEY,SECRET,ALIAS);

    /* connect to NETPIE to a specific APPID */
    microgear.connect(APPID);
}

void loop() {
    /* To check if the microgear is still connected */
    while (mySerial.available()>0) {
      Serial.println(mySerial.read());
      b=1;
     }
    }

    if (microgear.connected()) {
        Serial.println("connected");

        /* Call this method regularly otherwise the connection may be lost */
        microgear.loop();

        if (timer >= 1000) {
            Serial.println("Publish...");

            /* Chat with the microgear named ALIAS which is myself */
            if(b==1){
              Serial.println("Door is open");
              microgear.chat("my_server","OPEN");
              b=0;
            }
            
            timer = 0;
        } 
        else timer += 100;
    }
    else {
        Serial.println("connection lost, reconnect...");
        if (timer >= 5000) {
            microgear.connect(APPID);
            timer = 0;
        }
        else timer += 100;
    }
    delay(100);
}
