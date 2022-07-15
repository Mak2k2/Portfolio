# 1. Реализовать класс «Дата», функция-конструктор которого должна принимать дату в виде строки формата «день-месяц-год».
# В рамках класса реализовать два метода. Первый, с декоратором @classmethod, должен извлекать число, месяц, год и преобразовывать их тип к типу «Число».
# Второй, с декоратором @staticmethod, должен проводить валидацию числа, месяца и года (например, месяц — от 1 до 12).
# Проверить работу полученной структуры на реальных данных.

class Date:
    def __init__(self, date_str: str):
        self.date = date_str

    @classmethod
    def to_int(cls, content: str):
        a = cls.check(content)
        return a

    @staticmethod
    def check(content: str):
        date = content.split('-')
        if int(date[0]) > 31 or int(date[0]) < 1:
            return("Неправильно указан день!")
        elif 1 > int(date[1]) or int(date[1]) > 12:
            return("Неправильно указан месяц!")
        elif len(date[2]) != 4:
            return("Неправильно указан год!")
        else:
            return str(date)

print(Date.to_int("1-1-2022"))


