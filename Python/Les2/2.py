number = [0, 1, 2, 3, 4]
for i in number:
    number[i] = input("Введиет число >>> ")

number[0], number[1] = number[1], number[0]
number[2], number[3] = number[3], number[2]

print(number)

input("Press Enter to continue...")