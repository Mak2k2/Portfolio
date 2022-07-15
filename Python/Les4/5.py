import random
import functools

range_list = [x for x in range(100, 1001, 2)]
print(range_list)
random.shuffle(range_list)

def num_list (num, num_next):
    return num * num_next

total = functools.reduce(num_list, range_list)

print(total)