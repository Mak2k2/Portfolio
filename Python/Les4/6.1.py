import itertools

int_num = int(input("Введите число с которого начать генерацию >>> "))
int_range = int(input("Введите конечное число >>> "))
int_step = int(input("Введите шаг >>> "))

for x in itertools.count(int_num, int_step):
    if x > int_range:
        break
    print(x)