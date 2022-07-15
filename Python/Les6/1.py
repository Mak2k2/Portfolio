# 1. Создать класс TrafficLight (светофор) и определить у него один атрибут color (цвет) и метод running (запуск).
# Атрибут реализовать как приватный. В рамках метода реализовать переключение светофора в режимы:
# красный, желтый, зеленый. Продолжительность первого состояния (красный) составляет 7 секунд,
# второго (желтый) — 2 секунды, третьего (зеленый) — на ваше усмотрение.
# Переключение между режимами должно осуществляться только в указанном порядке (красный, желтый, зеленый).
# Проверить работу примера, создав экземпляр и вызвав описанный метод.

import time

class TrafficLight:
    __color: str

    def __init__(self, color: str):
        self.__color = color

    def running(self):
        while True:
            if self.__color == 'red':
                print("Цвет - Красный")
                time.sleep(7)
                self.__color = 'yellow'
            if self.__color == 'yellow':
                print("Цвет - Желтый")
                time.sleep(2)
                self.__color = 'green'
            if self.__color == 'green':
                print("Цвет - Зеленый")
                time.sleep(10)
                self.__color = 'red'

color = TrafficLight('yellow')

color.running()