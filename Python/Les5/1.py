# 1. Создать программно файл в текстовом формате,
# записать в него построчно данные, вводимые пользователем.
# Об окончании ввода данных свидетельствует пустая строка.

with open(r'data.txt', 'w+') as printable:
    while True:
        data_in = input("Введите данные >>> ")
        if data_in == '':
            break
        print(data_in, file=printable)

with open(r'data.txt') as printable:
    for data_out in printable:
        print(data_out)