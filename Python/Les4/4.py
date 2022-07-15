import random

range_list = [random.randint(1, 99) for x in range(1, 20)]

print(range_list)

for num in range_list:
    check_list = 0
    for x in range_list:
        if num == x: check_list += 1
    if check_list > 1:
        for y in range(check_list):
            range_list.remove(num)

print(range_list)
