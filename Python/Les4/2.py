import random

range_list = [x for x in range(1, 999)]

random_list = []
for i in range(13):
    random_list.append(random.choice(range_list))

print(random_list)

check = []
i = len(random_list) - 1
for num in random_list:
    if i < 0: break
    if random_list[i - 1] > random_list[i]:
        check.append(random_list[i - 1])
    else:
        check.append(random_list[i])
    i -= 2

check.reverse()
print(check)
