my_list = [7, 5, 3, 3, 2]
tmp_list = []

my_list.sort(reverse=True)

input_number = int(input("Введите число >>> "))

if input_number > 9 or input_number < 0: exit("Не правильное число!")

for num in my_list:
    if num > input_number:
        tmp_list.append(num)

tmp_list.append(input_number)
n = len(tmp_list)
my_list[:n-1] = tmp_list
my_list = my_list[1:]

print(my_list)

input("Press Enter to continue...")