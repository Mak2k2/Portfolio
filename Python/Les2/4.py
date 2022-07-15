user_string = input("Введите строку >>> ")

split_sting = user_string.split()

i = 1
for word in split_sting:
    print(f"{i}. {word[0:10]}")
    i += 1

input("Press Enter to continue...")