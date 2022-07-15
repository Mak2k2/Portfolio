user_number = input("Введите число >>> ")
i = 0
result = 0
while i < len(user_number):
    int_user_number = int(user_number[i])
    if int_user_number > result:
        result = int_user_number
    i += 1
print(result)
input("Press Enter to continue...")
