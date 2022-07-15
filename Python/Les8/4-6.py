# 4. Начните работу над проектом «Склад оргтехники». Создайте класс, описывающий склад.
# А также класс «Оргтехника», который будет базовым для классов-наследников.
# Эти классы — конкретные типы оргтехники (принтер, сканер, ксерокс).
# В базовом классе определить параметры, общие для приведенных типов.
# В классах-наследниках реализовать параметры, уникальные для каждого типа оргтехники.
# 5. Продолжить работу над первым заданием. Разработать методы, отвечающие за приём оргтехники на склад и передачу в определенное подразделение компании.
# Для хранения данных о наименовании и количестве единиц оргтехники, а также других данных, можно использовать любую подходящую структуру, например словарь.
# 6. Продолжить работу над вторым заданием. Реализуйте механизм валидации вводимых пользователем данных.
# Например, для указания количества принтеров, отправленных на склад, нельзя использовать строковый тип данных.
#
# Подсказка: постарайтесь по возможности реализовать в проекте «Склад оргтехники» максимум возможностей, изученных на уроках по ООП.

class NumError(Exception):
    def __init__(self, num):
        self.num = num

    def __str__(self):
        return (f"{self.num} - Неправильно указано количество!")

class Warehouse:
    model: str
    quantity: int
    device_type: str
    department: str

    __storage: list = []

    def add(self, department, device_type, model, quantity: int):
        if quantity < 1:
            raise NumError(quantity)
        self.department = department
        self.device_type = device_type
        self.model = model
        self.quantity = quantity
        self.check = False

        for x in self.__storage:
            if x[0] == self.department and x[1] == self.device_type and x[2] == self.model:
                x[3] += self.quantity
                self.check = True
        if not self.check:
            self.__storage.append([self.department, self.device_type, self.model, self.quantity])
        if not self.__storage:
            self.__storage.append([self.department, self.device_type, self.model, self.quantity])

    def __str__(self):
        return str(self.__storage)

    def findModel(self, model_find):
        for y in self.__storage:
            if y[2] == model_find:
                return self.quantity

    def move(self, department, device_type, model, quantity, new_department):
        if quantity < 1:
            raise NumError(quantity)
        self.department = department
        self.device_type = device_type
        self.model = model
        self.quantity = quantity
        self.new_department = new_department
        self.check = False

        for x in self.__storage:
            if x[0] == self.department and x[1] == self.device_type and x[2] == self.model:
                if x[3] < self.quantity:
                    raise NumError(self.quantity)
                x[3] -= self.quantity
                self.check = True
        if self.check:
            self.add(self.new_department, self.device_type, self.model, self.quantity)

class Equipment:
    department = "Equipment"
    quantity: int

    def __init__(self, device_type, model, quantity: int):
        self.model = model
        self.quantity = quantity
        self.device_type = device_type

    def add(self, warehouse):
        self.warehouse = warehouse
        self.warehouse.add(self.department, self.device_type, self.model, self.quantity)

class Printer(Equipment):
    model: str
    quantity: int
    device_type = 'Printer'

    def __init__(self, model, quantity: int):
        self.model = model
        self.quantity = quantity

class Scanner(Equipment):
    model: str
    quantity: int
    device_type = 'Scanner'

    def __init__(self, model, quantity: int):
        self.model = model
        self.quantity = quantity

class Xerox(Equipment):
    model: str
    quantity: int
    device_type = 'Xerox'

    def __init__(self, model, quantity: int):
        self.model = model
        self.quantity = quantity

accounting = Warehouse()

scanner1 = Scanner("model2", 12)
scanner2 = Scanner("model2", 3)
scanner3 = Scanner("model3", 3)
scanner4 = Scanner("model3", 2)

scanner1.add(accounting)
scanner2.add(accounting)
scanner3.add(accounting)
scanner4.add(accounting)

print(accounting)

printer1 = Printer("Model1", 50)
printer2 = Printer("Model1", 11)
printer3 = Printer("Model1", 7)

printer1.add(accounting)
printer2.add(accounting)
printer3.add(accounting)

print(accounting)

accounting.move("Equipment", "Printer", "Model1", 3, "Production Department")

print(accounting)