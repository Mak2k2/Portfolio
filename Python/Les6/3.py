# 3. Реализовать базовый класс Worker (работник), в котором определить атрибуты: name, surname, position (должность), income (доход).
# Последний атрибут должен быть защищенным и ссылаться на словарь, содержащий элементы: оклад и премия, например, {"wage": wage, "bonus": bonus}.
# Создать класс Position (должность) на базе класса Worker.
# В классе Position реализовать методы получения полного имени сотрудника (get_full_name) и дохода с учетом премии (get_total_income).
# Проверить работу примера на реальных данных (создать экземпляры класса Position, передать данные, проверить значения атрибутов, вызвать методы экземпляров).

class Worker:
    def __init__(self, name: str, surname: str, position: str):
        self.name = name
        self.surname = surname
        self.position = position
        self.__income = {"wage": 1000, "bonus": 200}

    def Income(self):
        return self.__income

class Position(Worker):
    def get_full_name(self):
        return f"{self.name} {self.surname}"

    def get_total_income(self):
        total = self.Income()
        return f"{total['wage'] + total['bonus']}"

worker_1 = Position("John", "Dou", "Admin")

print(f"Работник - {worker_1.get_full_name()}, доход - {worker_1.get_total_income()}")

worker_2 = Position("Artur", "Dou", "Admin")

print(f"Работник - {worker_2.get_full_name()}, доход - {worker_2.get_total_income()}")