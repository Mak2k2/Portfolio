# 3. Реализовать программу работы с органическими клетками, состоящими из ячеек.
# Необходимо создать класс Клетка. В его конструкторе инициализировать параметр, соответствующий количеству ячеек клетки (целое число).
# В классе должны быть реализованы методы перегрузки арифметических операторов: сложение (add()), вычитание (sub()), умножение (mul()), деление (truediv()).
# Данные методы должны применяться только к клеткам и выполнять увеличение, уменьшение, умножение и целочисленное (с округлением до целого) деление клеток, соответственно.

class Colony:
    def __init__(self, cells: int):
        self.cells = cells

    def __str__(self):
        return f'Количество: {self.cells * "*"}'

    def __add__(self, other: int):
        return Colony(self.cells + other.cells)

    def __sub__(self, other: int):
        if self.cells < other.cells:
            return('разность меньше нуля!')
        else:
            return Colony(self.cells - other.cells)

    def __mul__(self, other: int):
        return Colony(self.cells * other.cells)

    def __truediv__(self, other: int):
        if self.cells < other.cells:
            return('разность меньше нуля!')
        else:
            return Colony(round(self.cells // other.cells))

    def make_order(self, number):
        string_cell = ''
        for i in range(int(self.cells / number)):
            string_cell += f'{"*" * number} \\n'
        string_cell += f'{"*" * (self.cells % number)}'
        return string_cell

colony1 = Colony(50)
colony2 = Colony(12)

print(colony1)
print(colony1 + colony2)
print(colony1 - colony2)
print(colony2.make_order(5))
print(colony1.make_order(10))
print(colony1 / colony2)