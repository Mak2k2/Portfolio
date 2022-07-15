# 5. Создать (программно) текстовый файл, записать в него программно набор чисел, разделенных пробелами. Программа
# должна подсчитывать сумму чисел в файле и выводить ее на экран.

from random import randint

quantity = 5
min_num = 0
max_num = 10
with open('data5.txt', 'w', encoding='utf-8') as printable:
    for q in range(quantity):
        printable.write(f"{randint(min_num, max_num)} ")

with open('data5.txt', 'r', encoding='utf-8') as printable:
    read_str = printable.readline()
    num_sum = 0
    for num in read_str.split():
        num_sum += int(num)
    print(f"Сумма чисел: {num_sum}")