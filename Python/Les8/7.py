class Сomplex_number:
    def __init__(self, num1, num2):
        self.num1 = num1
        self.num2 = num2

    def __add__(self, num_in):
        out = (self.num1 + self.num2) + (num_in.num1 + num_in.num2)
        print(f'Сложение = {out}')

    def __mul__(self, num_in):
        out = (self.num1 + self.num2) * (num_in.num1 + num_in.num2)
        print(f'Умножение = {out}')

number1 = Сomplex_number(10, 20)
number2 = Сomplex_number(30, 40)
number1 + number2
number1 * number2