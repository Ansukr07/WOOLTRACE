with open('/home/jayy/sih/src/context/GlobalStateContext.jsx') as f:
    lines = f.readlines()
for i in range(549, 605):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end="")
