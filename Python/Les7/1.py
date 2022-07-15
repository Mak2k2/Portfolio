# 1. Реализовать класс Matrix (матрица). Обеспечить перегрузку конструктора класса (метод init()), который должен принимать данные (список списков) для формирования матрицы.
#
# Подсказка: матрица — система некоторых математических величин, расположенных в виде прямоугольной схемы.
# Примеры матриц: см. в методичке.
# Следующий шаг — реализовать перегрузку метода str() для вывода матрицы в привычном виде.
# Далее реализовать перегрузку метода add() для реализации операции сложения двух объектов класса Matrix (двух матриц). Результатом сложения должна быть новая матрица.

class Matrix:
    def __init__(self, list_in):
        self.list_in = list_in

    def __add__(self, other):
        matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

        for i in range(len(self.list_in)):

            for j in range(len(other.list_in[i])):
                matrix[i][j] = self.list_in[i][j] + other.list_in[i][j]

        return str('\n'.join(['\t'.join([str(j) for j in i]) for i in matrix]))

    def __str__(self, matrix=None):
        return str('\n'.join(['\t'.join([str(j) for j in i]) for i in matrix]))

matrix1 = Matrix([[1, 2, 8], [5, 4, 2], [8, 7, 4]])
matrix2 = Matrix([[4, 8, 8], [8, 1, 3], [2, 2, 4]])

print(matrix1 + matrix2)
