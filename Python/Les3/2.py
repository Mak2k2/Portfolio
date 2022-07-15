name_input = input("Введите имя >>> ")
surname_input = input("Введите фамилию >>> ")
year_of_birth_input = input("Введите год рождения >>> ")
city_input = input("Введите город проживания >>> ")
email_input = input("Введите email >>> ")
tel_input = input("Введите телефон >>> ")

def my_func (name, surname, year_of_birth, city, email, tel):
    return name + " " + surname + " " + year_of_birth + " " + city + " " + email + " " + tel

print(my_func(name = name_input, surname = surname_input, year_of_birth = year_of_birth_input, city = city_input, email = email_input, tel = tel_input))