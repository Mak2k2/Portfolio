# 4.Реализуйте базовый класс Car. У данного класса должны быть следующие атрибуты: speed, color, name, is_police (булево).
# А также методы: go, stop, turn(direction), которые должны сообщать, что машина поехала, остановилась, повернула (куда).
# Опишите несколько дочерних классов: TownCar, SportCar, WorkCar, PoliceCar.
# Добавьте в базовый класс метод show_speed, который должен показывать текущую скорость автомобиля.
# Для классов TownCar и WorkCar переопределите метод show_speed.
# При значении скорости свыше 60 (TownCar) и 40 (WorkCar) должно выводиться сообщение о превышении скорости.
#
# Создайте экземпляры классов, передайте значения атрибутов. Выполните доступ к атрибутам, выведите результат. Выполните вызов методов и также покажите результат.

class Car:
    def __init__(self, speed, color, name, police=False):
        self.speed = speed
        self.color = color
        self.name = name
        self.is_police = police
        self.current_speed = speed

    def go(self):
        print(f"{self.name} Go")
        self.current_speed += self.speed

    def stop(self):
        print(f"{self.name} Stop")
        self.current_speed = 0

    def turn(self, direction: str):
        if direction == 'left' or direction == 'right':
            print(f"Поворот - {direction}")
        else: print("Unknown action")

    def show_speed(self):
        return self.current_speed

class TownCar(Car):
    def show_speed(self):
        print(f"Скорость = {self.current_speed}")
        if self.current_speed > 60:
            print("Превышена скорость!")

class WorkCar(Car):
    def show_speed(self):
        print(f"Скорость = {self.current_speed}")
        if self.current_speed > 40:
            print("Превышена скорость!")

class PoliceCar(Car):
    def show_speed(self):
        print(f"Скорость = {self.current_speed}")

    def __init__(self, speed, color, name):
        self.speed = speed
        self.color = color
        self.name = name
        self.is_police = True
        self.current_speed = speed

car_1 = TownCar(20, 'red', 'car 1')

car_1.go()
car_1.show_speed()
car_1.go()
car_1.show_speed()
car_1.go()
car_1.show_speed()

car_1.turn('left')
car_1.turn('right')
car_1.stop()
car_1.go()
car_1.show_speed()

car_2 = PoliceCar(40, 'blue', 'Police')

car_2.go()
car_2.show_speed()
car_2.go()
car_2.show_speed()
