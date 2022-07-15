num = []
num.append(int(input("Ведите число 1 >>> ")))
num.append(int(input("Введите число 2 >>> ")))
num.append(int(input("Введите число 3 >>> ")))


def my_func(num1, num2, num3):
    numbers = []
    numbers.append(num1)
    numbers.append(num2)
    numbers.append(num3)
    numbers.sort()
    return numbers[1] + numbers[2]

print(my_func(*num))
