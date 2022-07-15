cash = int(input("Введите количество выручки >>> "))
loss = int(input("Введите издержки >>> "))
if cash > loss:
    print("Прибыль есть!")
    profitability = ((cash - loss) / cash) * 100
    print(f"Рентабильность = {profitability} %")
    employees = int(input("Введите количество сотрудников >>> "))
    print(f"Прибыль на сотрудника = {(cash - loss) / employees}")
else:
    print("Денег нет, но вы держитесь!")
input("Press Enter to continue...")