month = ["Зима", "Зима", "Весна", "Весна", "Весна", "Лето", "Лето", "Лето", "Осень", "Осень", "Осень", "Зима"]
month_dict = {"0": "Зима", "1": "Зима", "2": "Весна", "3": "Весна", "4": "Весна", "5": "Лето", "6": "Лето", "7": "Лето", "8": "Осень", "9": "Осень", "10": "Осень", "11": "Зима"}

input_number = int(input("Введите номер месяца >>> "))

if input_number > 12 or input_number < 1: exit("Не правильное число!")

if input_number <= 12:
    input_number = input_number - 1
    print(month[(input_number)])
    print(month_dict.get(str(input_number)))
else:
    print("Не верное число!")

input("Press Enter to continue...")