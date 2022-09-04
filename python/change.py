import sys
sys.stdin = open("input.txt")
sys.stdout = open("output.txt", "w")

while True:
    line = input().rstrip()

    if line == '0':
        break

    line = line[:len(line)-1]
    line = line.split("=")

    op = line[0].strip()
    num = line[1].strip()
    
    result = "\""+ num + "\"" + ': ' + "\"" + op + "\"" + ','

    print(result)