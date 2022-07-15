a_kilometers = int(input("Введите количество километров за первый день >>> "))
b_kilometers = int(input("Введите желаемый результат >>> "))
i = 1
while a_kilometers < b_kilometers:
    a_kilometers += (a_kilometers / 100) * 10
    print(a_kilometers)
    i += 1
print(f"\n Желаемый результат будет достигнут на {i}-й день")
input("Press Enter to continue...")
