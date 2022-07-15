import itertools

repeat = (input("Введите через пробел то,что нужно повторить >>> ")).split()
count = int(input("Введите сколько раз >>> "))

i = 1
for x in itertools.cycle(repeat):
    if i > count: break
    print(x)
    i += 1