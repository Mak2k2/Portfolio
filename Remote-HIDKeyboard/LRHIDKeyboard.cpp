#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <termios.h>
#include <time.h>
#include <ncurses.h>

#include "HIDKeyboard.h"

char myport[] = "/dev/ttyS2"; //указываем нужный serial port можно менять прямо тут

//использование кнопок управлениея конвертером можно менять прямо тут
char nul[] = "";
char menu[] = "/sys/class/gpio_sw/PA14/data"; //меню
char zoom[] = "/sys/class/gpio_sw/PD14/data"; //зуум
char kup[] = "/sys/class/gpio_sw/PC4/data"; //верх
char kdn[] = "/sys/class/gpio_sw/PC7/data"; //низ
char klf[] = "/sys/class/gpio_sw/PG8/data"; //лево
char krt[] = "/sys/class/gpio_sw/PA21/data"; //право

uint8_t buf[8] = {
	0 }; /* Keyboard report buffer */

int open_port(char *devname) //открываем serial port
{
  int fd;
  fd = open(devname, O_RDWR | O_NOCTTY | O_NDELAY);
  if(fd == -1) //проверка
  {
    printw("Port is not open! %s" , devname);
    return -1;
  }
  else
  {
    fcntl(fd, F_SETFL, 0);
    printw("Open port %s", devname);
  }
//настройка порта
  struct termios port_settings;
  cfsetispeed(&port_settings, B9600);
  cfsetospeed(&port_settings, B9600);
  port_settings.c_cflag &= ~PARENB;
  port_settings.c_cflag &= ~CSTOPB;
  port_settings.c_cflag &= ~CSIZE;
  port_settings.c_cflag |= CS8;
  tcsetattr(fd, TCSANOW, &port_settings);
  return(fd);
}

int alt_check(int check) //Если последовательность с ALT, возвращает символ следующий за ALT,в противном случае "0"
{
  if(check == 27)
  {
    nodelay(stdscr,TRUE);
    check = getch();
    if (check == -1) return ESCAPE; //Если данных не последовало значит Esc
    nodelay(stdscr,FALSE);
    return check;
  }
  //else return 0;
  return 0;
}

int hot_key(int fd, int alt, int vchar) //комбинации 
{
  if(alt != 0)
  {
    if (alt == 330) //Нажато "Alt" + "Delete" отправка Ctrl + Alt + Delete
    {
      vchar = 0;
      buf[0] = 0x04|0x01;
      buf[2] = HIDTable[alt];
      write(fd, buf, 8);
      return 0;
    }
    if (alt == 114) //Нажато "Alt" + "r" отправка Win + r
    {
      vchar = 0;
      buf[0] = 0x08;
      buf[2] = HIDTable[alt];
      write(fd, buf, 8);
      return 0;
    }
    if (alt == 52) //Нажато "Alt" + "4" отправка Alt + F4
    {
      vchar = 0;
      buf[0] = 0x04;
      buf[2] = 0x3d;
      write(fd, buf, 8);
      return 0;
    }
    if (alt == 116) //Нажато "Alt" + "t" отправка Alt + Tab
    {
      vchar = 0;
      buf[0] = 0x04;
      buf[2] = 0x2b;
      write(fd, buf, 8);
      return 0;
    }
    if (alt == 44) //Нажато "Alt" + "," отправка Alt + Shift
    {
      vchar = 0;
      buf[0] = 0x04|0x02;
      write(fd, buf, 8);
      return 0;
    }
    if (alt == 46) //Нажато "Alt" + "." отправка Ctrl + Shift
    {
      vchar = 0;
      buf[0] = 0x01|0x02;
      write(fd, buf, 8);
      return 0;
    }
  }
  else
  {
        if (vchar == 17) //выход по нажатию "Ctrl" + "q"
    {
      endwin();
      exit(0);
    }

    //Управление конвертером 
    *nul = '\0';
    if (vchar == 28) strcpy(nul, menu); // "Ctrl" + "\"
    if (vchar == 31) strcpy(nul, zoom); // "Ctrl" + "/"
    if (vchar == 566) strcpy(nul, kup); // "Ctrl" + "up"
    if (vchar == 525) strcpy(nul, kdn); // "Ctrl" + "down"
    if (vchar == 545) strcpy(nul, klf); // "Ctrl" + "left"
    if (vchar == 560) strcpy(nul, krt); // "Ctrl" + "right"

    FILE *f = fopen(nul, "w"); //Открываем файл

    if (f != '\0')
    {
      fwrite("1", 1, 1, f);
      int wrt = fclose(f); //Пишем в файл
      usleep(70000);
      if (wrt == 0)
      {
        FILE *f = fopen(nul, "w");
        fwrite("0", 1, 1, f);
        fclose(f);
      }
    else printf("error write file:  %s", nul);
    return 0;
    }
    return vchar;
  }
}

int send_key(int fd, int altkey, int getkey) //Отправка нажатий
{
  if (altkey == ESCAPE)
  {
    buf[0] = 0x00;
    buf[2] = 0x29;
    write(fd, buf, 8);
    return 1;
  }
  if (altkey != 0)
  {
    buf[0] = 0x04;
    buf[2] = HIDTable[altkey];
    write(fd, buf, 8);
    return 1;
  }
  else
  {
    if (getkey == 0) return 0;
    //printf("KEY NAME : %s - %d\n", keyname(getkey),getkey); //Для отладки
    buf[0] = modifierTable[getkey];
    buf[2] = HIDTable[getkey];
    write(fd, buf, 8);
    return 1;
  }
  return(-1);
}

int release_key(int fd) // Отпустить нажатые клавиши
{
  buf[0] = 0;
  buf[2] = 0;
  write(fd, buf, 8);
}

int main(void)
{
  initscr();
  keypad(stdscr,TRUE); //для захвата спец символов
  raw(); //для захвата комбинаций
  int fd = open_port(myport);
  printw("\nHOT KEYS: Alt + Delete = Ctrl + Alt + Delete   Alt + r = Win + r   Alt + 4 = Alt + F4   Alt + t = Alt + Tab   Alt + , = Alt + Shift   Alt + . = Ctrl + Shift");
  printw("\nGPIO: MENU = Ctrl + \\  ZOOM = Ctrl + /  UP = Ctrl + up  DOWN = Ctrl + down  LEFT = Ctrl + left  RIGHT = Ctrl + right");
  printw("\n Exit = Ctrl + q");
  move(10,1);
  refresh();
    while (fd != -1)
    {
      int pkey = getch();
      int alt = alt_check(pkey);
      int hot = hot_key(fd, alt, pkey);
      send_key(fd, alt, hot);
      release_key(fd);
    }
  endwin();
}