# 3. Создайте собственный класс-исключение, который должен проверять содержимое списка на наличие только чисел.
# Проверить работу исключения на реальном примере.
# Необходимо запрашивать у пользователя данные и заполнять список только числами.
# Класс-исключение должен контролировать типы данных элементов списка.

import re

class NumError(Exception):
    def __init__(self, list):
        self.list = list

    def __str__(self):
        return (f"{self.list} - Это не число!")

my_list = []
while True:
    try:
        num = input("Введите число >>> ")
        if num == 'stop': break
        if re.match(r'\D', num):
            raise NumError(num)
        else:
            my_list.append(num)
    except NumError as e:
        print(NumError(num))
    print(my_list)
