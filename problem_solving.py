import numpy as np
import re

def censor(s):
    
    # change 'a' in '#'
    string_a = re.split(" a ", s)
    string_a = " # ".join(string_a)
    string_a = re.split("A ", string_a)
    string_a = "# ".join(string_a)
    
    # change 'an' in '##'
    string_an = re.split(" an ", string_a)
    string_an = " ## ".join(string_an)
    string_an = re.split("An ", string_an)
    string_an = "## ".join(string_an)
    
    # change 'the' in '###'
    string_the = re.split(" the ", string_an)
    string_the = " ### ".join(string_the)
    string_the = re.split("The ", string_the)
    r = "### ".join(string_the)
    
    # add <n11232480> at the end of the string
    r= r+" <n11232480>"
    return r

def fertiliser(an, ap, bn, bp, n, p):
    #Create the matrice that reflects the equation and invert it
    y = np.linalg.inv(np.array([[an, bn], [ap, bp]]))
    #Store the result matrice in result
    result = np.dot(y,np.transpose(np.array([[n,p]])))
    
    #convert the result into a list and extract the values of a and b
    a = result.tolist()[0][0]
    b = result.tolist()[1][0]
    
    return a, b

# test

if __name__ == '__main__':
   try:
      print(censor('The cat ate a mouse.')) # should give "### cat ate # mouse. <n1234567>"
   except NameError:
      print("Not attempting censoring problem")

   try:
      print(fertiliser(1, 0, 0, 1, 2, 2)) # should give (2.0, 2.0)
   except NameError:
      print("Not attempting fertiliser problem")

   import random
   try:
      random.seed(0)
      totalprofit = 0
      for round in range(10000):
         if random.randint(0,1) == 0:
            headsprob = 0.7
         else:
            headsprob = 0.4

         previousOutcome = None
         state = None
         profit = 0
         odds = dict()
         for _ in range(100):
            odds['heads'] = random.uniform(1, 3)
            odds['tails'] = random.uniform(1, 3)
            
            bet, state = makeBet(odds['heads'], odds['tails'], previousOutcome, state)
            
            previousOutcome = 'heads' if random.random() < headsprob else 'tails'
            if bet == previousOutcome:
               profit += odds[bet] - 1
            elif bet != 'no bet':
               profit -= 1          # stake lost

         print("Probability of heads was", headsprob, "Profit was", profit)
         totalprofit += profit
      print("Average profit per run:", totalprofit / 10000)

   except NameError as e:
      print("Not attempting probability problem")
    
