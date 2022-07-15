# Создать вручную и заполнить несколькими строками текстовый файл,
# в котором каждая строка должна содержать данные о фирме: название, форма собственности, выручка, издержки.
#
# Пример строки файла: firm_1 ООО 10000 5000.
# Необходимо построчно прочитать файл, вычислить прибыль каждой компании,
# а также среднюю прибыль. Если фирма получила убытки, в расчет средней прибыли ее не включать.
# Далее реализовать список. Он должен содержать словарь с фирмами и их прибылями,
# а также словарь со средней прибылью. Если фирма получила убытки, также добавить ее в словарь (со значением убытков).
#
# Пример списка: [{“firm_1”: 5000, “firm_2”: 3000, “firm_3”: 1000}, {“average_profit”: 2000}].
# Итоговый список сохранить в виде json-объекта в соответствующий файл.

import json

profit = {}
average = {}
prof = 0
prof_aver = 0
i = 0
with open('data7.txt', 'r') as printable:
    for line in printable:
        name, firm, earning, costs = line.split()
        profit[name] = int(earning) - int(costs)
        if profit.setdefault(name) >= 0:
            prof = prof + profit.setdefault(name)
            i += 1
    if i != 0:
        prof_aver = prof / i
        print(f"Прибыль средняя - {prof_aver:.2f}")
    else:
        print(f"Прибыль отсутсвует")
    average = {'средняя прибыль': round(prof_aver)}
    profit.update(average)
    print(f"Прибыль компании - {profit}")

with open('file_7.json', 'w', encoding='utf-8') as printable:
    json.dump(profit, printable)

    js_str = json.dumps(profit)
    print(f"Json - {js_str}")