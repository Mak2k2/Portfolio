n = int(input("Введите число >>> "))

def fact(num):
    result = 1
    for i in range(1, num + 1):
        result *= i
        yield result

for el in fact(n):
    print(el)