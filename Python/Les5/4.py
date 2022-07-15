# 4. Создать (не программно) текстовый файл со следующим содержимым:
# One — 1
# Two — 2
# Three — 3
# Four — 4
# Необходимо написать программу, открывающую файл на чтение и считывающую построчно данные. При этом английские
# числительные должны заменяться на русские. Новый блок строк должен записываться в новый текстовый файл.

rus = {
    '0': 'ноль',
    '1': 'один',
    '2': 'два',
    '3': 'три',
    '4': 'четыре',
    '5': 'пять',
    '6': 'шесть',
    '7': 'семь',
    '8': 'восемь',
    '9': 'девять'
}

with open('data4.txt', 'r') as printable:
    read_eng = printable.read()
    eng = (num_eng for num_eng in read_eng.splitlines())

with open('data4_rus.txt', 'w', encoding='utf-8') as printable:
    while True:
        try:
            num = next(eng).split(" — ")[1]
            printable.write(f"{rus[num]} - {num}\n")
        except StopIteration:
            break