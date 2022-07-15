import sys

try:
    script, vhours, employee, bonus = sys.argv
except ValueError:
    print(f"{script} {vhours} {employee} {bonus}")
    exit()

vhours = int(vhours)
employee = int(employee)
bonus = int(bonus)

if vhours < 0 or employee < 0: exit("Введено неверное число!")

total = (vhours * employee) + bonus

print(f"Ваша зарплата {total} ")

input("Press Enter to continue...")