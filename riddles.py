import random 

class Sign:
    mark: str # flower, leaf, skull
    circled: bool
    filled: bool
    
    def __init__(self, mark: str, circled: bool, filled: bool):
        self.mark = mark
        self.circled = circled
        self.filled = filled
        
    @staticmethod
    def random_sign():
        return Sign(random.choice(["flower", "leaf", "skull", "book"]), random.choice([True, False]), random.choice([True, False]))
    
    def __eq__(self, other):
        return self.mark == other.mark and self.circled == other.circled and self.filled == other.filled
    
    def compare(self, other, index):
        if index == 0:
            return self.mark == other.mark
        elif index == 1:
            return self.circled == other.circled
        elif index == 2:
            return self.filled == other.filled
        else:
            raise Exception("Invalid index")

def mists_riddle():
    
    solution = Sign.random_sign()
    uniqueProperty = random.randint(0, 2) # 0: mark, 1: circled, 2: filled
    
    # return 4 wrong solutions where roll is not the same as the solution
    wrong_solutions = []
    while len(wrong_solutions) < 4:
        wrong_solution = Sign.random_sign()
        
        if wrong_solution.compare(solution, uniqueProperty):
            continue # skip this wrong solution as it does not differ from the solution
        
        if len(wrong_solutions) == 0:
            wrong_solutions.append(wrong_solution)
        else:
            # check if this wrong solution already exists
            exists = False
            for ws in wrong_solutions:
                if ws == wrong_solution:
                    exists = True
                    break
            if not exists:
                wrong_solutions.append(wrong_solution)
                    
    sol_index = random.randint(0, 4)
    wrong_solutions.insert(sol_index, solution)
    print("The room has five doors left to right:")
    for i in range(5):
        sign = wrong_solutions[i]
        ostr = f'''A {"filled " if sign.filled else ""}{sign.mark}{" with a circle around it" if sign.circled else ""}'''
        print(f"Door {i+1}: {ostr}")
    
    desc = [
        "Shape",
        "Circle",
        "Fill"
    ]
    
    print("The solution is door number " + str(sol_index + 1) + ".", "Reason:", desc[uniqueProperty])


mists_riddle()