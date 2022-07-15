input_word = input("Введите слово >>> ")
input_words = input("Введите строку >>> ")

input_words = input_words.split()

def int_func (word):
    return word.capitalize()

print(int_func(input_word))

for w in input_words:
    print(int_func(w))
