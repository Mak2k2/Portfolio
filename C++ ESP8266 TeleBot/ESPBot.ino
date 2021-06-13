#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <EEPROM.h>
#include <stdlib.h>

// Initialize Wifi connection to the router
char ssid[] = "**";     // your network SSID (name)
char password[] = "***"; // your network key

// Initialize Telegram BOT
#define BOTtoken "**********************"  // your Bot Token (Get from Botfather)

WiFiClientSecure client;
UniversalTelegramBot bot(BOTtoken, client);

int Bot_mtbs = 1000; //mean time between scan messages
long Bot_lasttime;   //last time messages' scan has been done

//String mesid = "0";
String name_dev = "Розет";
String switch_button = "Вкл.";
String state_dev = "ВЫКЛЮЧЕНО ⚪";
bool state_port = false;
String chat_id = "";
String old_chat_id = "";
String message_id = "";

void writeEprom(int start_address, String in_string) {
  int len = in_string.length();
  if (len > 255){
    Serial.println("ERROR_EEPROM.write: Maximum line length exceeded");
  }

  len++;
  EEPROM.begin(start_address + len);
  EEPROM.write(start_address, len);
  start_address++;
  for (int n = 0; n < len; n++){
    int testvar = int(in_string[n]);
    EEPROM.write(start_address + n, testvar);
  }
  EEPROM.end();
}

String readEprom(int start_address) {
  EEPROM.begin(start_address);
  int len = EEPROM.read(start_address);
  EEPROM.begin(start_address + len);
  String out_string = "";

  for (int i = 1; i < len; i++) {
    int buf = EEPROM.read(start_address + i);
    out_string += char(buf);
  }
  return(out_string);
}

void editMessageInline(String chat_id, String message_id){
  if (state_port == true) {
    state_dev = "ВКЛЮЧЕНО 🔴";
    switch_button = "Выкл.";
  }
  else {
    state_dev = "ВЫКЛЮЧЕНО ⚪";
    switch_button = "Вкл.";
  }

  String keyboardJson = "[[\
  \{ 'text' : 'Сменить название', 'callback_data' : 'change_name' \}, \
  \{ 'text' : 'Таймер', 'callback_data' : 'time_set' \} ], \
 [\{ 'text' : '" + switch_button + "', 'callback_data' : 'switch_state' \} ]]";

  bot.editMessageWithInlineKeyboard(chat_id, message_id, name_dev + "\n сосояние:" + state_dev , "", keyboardJson);
  //return(message_id);
}

void defaultMessageReply(String chat_id) {
  String keyboardJson = "[[\"/НАСТРОЙКИ\", \"/РАСПИСАНИЕ\"],[\"/ОБНОВИТЬ\"]]";
  bot.sendMessageWithReplyKeyboard(chat_id, "ᅠ", "", keyboardJson, true);//!!ХИТРЫЙ ПРОБЕЛ
}

void inlineTimer(String chat_id, String message_id) {
  String keyboardJson = "[[\
  \{ 'text' : 'Минуты', 'callback_data' : 'time_minut' \}, \
  \{ 'text' : 'Секунды', 'callback_data' : 'time_second' \} ], \
 [\{ 'text' : 'Назад', 'callback_data' : 'time_back' \},\
  \{ 'text' : 'Старт', 'callback_data' : 'time_start' \}]]";

  bot.editMessageWithInlineKeyboard(chat_id, message_id, name_dev + "\n сосояние:" + state_dev , "", keyboardJson);
  //return(message_id);
}

void inlineMinut(String chat_id, String message_id) {
  String keyboardJson = "[[\
  \{ 'text' : '7', 'callback_data' : 'time_7' \}, \
  \{ 'text' : '8', 'callback_data' : 'time_8' \}, \
  \{ 'text' : '9', 'callback_data' : 'time_9' \} ], \
  [\{ 'text' : '1', 'callback_data' : 'time_minut' \}, \
  \{ 'text' : '2', 'callback_data' : 'time_minut' \}, \
  \{ 'text' : '3', 'callback_data' : 'time_second' \} ], \
  [\{ 'text' : '1', 'callback_data' : 'time_minut' \}, \
  \{ 'text' : '2', 'callback_data' : 'time_minut' \}, \
  \{ 'text' : '3', 'callback_data' : 'time_second' \} ], \
  [\{ 'text' : 'Назад', 'callback_data' : 'time_set' \},\
  \{ 'text' : 'Принять', 'callback_data' : 'time_set' \}]]";

  bot.editMessageWithInlineKeyboard(chat_id, message_id, name_dev + "\n сосояние:" + state_dev , "", keyboardJson);
}

void handleNewMessages(int numNewMessages) {

  for (int i=0; i<numNewMessages; i++) {
    chat_id = String(bot.messages[i].chat_id);
    String text = bot.messages[i].text;
    String data = String(bot.messages[i].data);

    String from_name = bot.messages[i].from_name;
    if (from_name == "") from_name = "Guest";

    if (data == "switch_state") {
      if(state_port == true) state_port = false;
      else state_port = true;

      editMessageInline(chat_id, message_id);
    }

    if (data == "time_set") {
      inlineTimer(chat_id, message_id);
    }

    if (data == "time_back") {
      editMessageInline(chat_id, message_id);
    }

    if (data == "time_minut") {
      inlineMinut(chat_id, message_id);
    }

    if (text == "/u041eu0411u041du041eu0412u0418u0422u042c") {//refresh
      message_id = bot.sendMessage(chat_id, "Найдено устройство");
      Serial.println(message_id);
      editMessageInline(chat_id, message_id);
      defaultMessageReply(chat_id);
    }

    if (text == "/start") {
      message_id = bot.sendMessage(chat_id, "Найдено устройство");
      editMessageInline(chat_id, message_id);
      defaultMessageReply(chat_id);
    }
  }
}



void setup() {
  Serial.begin(115200);

  // Set WiFi to station mode and disconnect from an AP if it was Previously connected
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  // attempt to connect to Wifi network:
  Serial.print("Connecting Wifi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (millis() > Bot_lasttime + Bot_mtbs)  {
    int numNewMessages = bot.getUpdates(bot.last_message_received + 1);

    while(numNewMessages) {
      Serial.println("got response");
      handleNewMessages(numNewMessages);
      numNewMessages = bot.getUpdates(bot.last_message_received + 1);
    }

    Bot_lasttime = millis();
  }
}
