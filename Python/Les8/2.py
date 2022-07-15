# 2. Создайте собственный класс-исключение, обрабатывающий ситуацию деления на нуль.
# Проверьте его работу на данных, вводимых пользователем.
# При вводе пользователем нуля в качестве делителя программа должна корректно обработать эту ситуацию и не завершиться с ошибкой.

class ZeroError(Exception):
    def __init__(self, number):
        self.number = number

    def __str__(self):
        return (f"Вы ввели число {self.number}, на ноль делить нельзя!")

a = int(input("Введите делимое >>> "))
b = int(input("Введите делитель >>> "))

try:
    if b == 0:
        raise ZeroError(b)
    else:
        print(a / b)
except ZeroError as err:
    print(err)