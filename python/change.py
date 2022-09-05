import sys
import random
sys.stdin = open("input.txt")
sys.stdout = open("output.txt", "w")

color_set = set()

while True:
    line = input().rstrip()

    if line == '0':
        break

    line = line[:len(line)-1]
    line = line.split("=")

    op = line[0].strip()
    num = line[1].strip()

    code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

    while True:
        color = ''

        for i in range(6):
            color += code[random.randint(0, 15)]

        if color in color_set:
            continue
        else:
            color_set.add(color)
            break
    
    result = "\""+ op + "\"" + ': ' + "\"" + color + "\"" + ','

    print(result)