num = []
num.append(int(input("Ведите число 1 >>> ")))
num.append(int(input("Введите число 2 >>> ")))

def my_func(num1, num2):
    if num1 == 0: return("На ноль делить нельзя!")
    return num1 / num2

print(my_func(*num))