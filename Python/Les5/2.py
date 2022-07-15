# 2. Создать текстовый файл (не программно),
# сохранить в нем несколько строк,
# выполнить подсчет количества строк, количества слов в каждой строке.

with open(r'data2.txt') as printable:
    i = 0
    for string_in in printable:
        words = len(string_in.split())
        i += 1
        print(f"Строка номер {i}, количество слов {words} ")