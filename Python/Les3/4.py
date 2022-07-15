positive_number = int(input("Введите положительное число >>> "))
if positive_number <= 0: exit("Введено неверное число")
negative_number = int(input("Введите отрицательное число >>> "))
if negative_number >= 0: exit("Введено неверное число")

negative_number = abs(negative_number)

def my_func(x, y):
    result = 1
    for i in range(y):
        result = result * x
    return result

print(my_func(positive_number, negative_number))