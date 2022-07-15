seconds_input = int(input("Введите время в секундах >>> "))
if 86400 >= seconds_input >= 60:
    if seconds_input >= 3600:
        hours = (seconds_input // 3600)
        minutes = (seconds_input % 3600 // 60)
        seconds = (seconds_input % 3600 % 60)
        print(f"{hours}:{minutes}:{seconds}")
    else:
        minutes = (seconds_input // 60)
        seconds = (seconds_input % 60)
        print(f"00:{minutes}:{seconds}")
elif seconds_input >= 86400:
        print("Слишком большое число!")
else:
    print(f"00:00:{seconds_input}")
input("Press Enter to continue...")