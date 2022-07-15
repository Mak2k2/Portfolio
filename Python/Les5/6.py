# 6. Необходимо создать (не программно) текстовый файл, где каждая строка описывает учебный предмет и наличие
# лекционных, практических и лабораторных занятий по этому предмету и их количество. Важно, чтобы для каждого
# предмета не обязательно были все типы занятий. Сформировать словарь, содержащий название предмета и общее
# количество занятий по нему. Вывести словарь на экран.
#
# Примеры строк файла: Информатика: 100(л) 50(пр) 20(лаб).
# Физика: 30(л) — 10(лаб)
# Физкультура: — 30(пр) —
# Пример словаря: {“Информатика”: 170, “Физика”: 40, “Физкультура”: 30}

with open('data6.txt', 'r') as printable:
    data = printable.read()
    lessons = (les for les in data.splitlines())
    dictionary = dict()
    lec = 0
    pract = 0
    lab = 0
    while True:
        try:
            lesson = next(lessons)
            try:
                lec = int(lesson.split()[1].split('(')[0])
            except ValueError:
                pass
            try:
                pract = int(lesson.split()[2].split('(')[0])
            except ValueError:
                pass
            try:
                lab = int(lesson.split()[3].split('(')[0])
            except ValueError:
                pass
            all_les = lec + pract + lab
            dictionary[lesson.split(':')[0]] = all_les

        except StopIteration:
            break
print(f"Словарь - {dictionary}")