x = 1
result = 0
while x == 1:
    string_num = (input("Введите числа через пробел >>> "))
    string_num = string_num.split()
    for num in string_num:
        result = result + int(num)
    print(result)
    input("Чтобы продолжить нажмите Enter или ctrl + c для завершения")