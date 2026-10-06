a= [1,2,3]
b= [1,2,3]  
c=a 
print(a is b) # → False (different objects in memory)
print(a is c) # → True (same object in memory)
print(a == b) # → True (same values)
print(a == c) # → True (same values)
print(id(a)) # → 140706091168320 (memory address of a)
print(id(b)) # → 140706091168384 (memory address of b)
print(id(c)) # → 140706091168320 (memory address of c, same as a)


#assignment operator

#Arithmetic Operators
print(5 + 3) #addition
print(5 - 3) #subtraction
print(5 * 3) #multiplication
print(5 / 3) #division
print(5 // 3) #floor division
print(5 % 3) #modulus
print(5 ** 3) #exponentiation

#comparison operator
print(5 == 3) # equality
print(5 != 3) # inequality
print(5 > 3) # greater than
print(5 < 3) # less than
print(5 >= 3) # greater than or equal to
print(5 <= 3) # less than or equal to

#Assignment Operators
print(5) # assignment
print(5 + 3) # addition assignment
print(5 - 3) # subtraction assignment
print(5 * 3) # multiplication assignment
print(5 / 3) # division assignment
print(5 // 3) # floor division assignmentp

#Logical Operators
print(5 and 3) # logical AND
print(5 or 3) # logical OR
print(not 5) # logical NOT
print(not 0) # logical NOT

#Bitwise Operators
print(5 & 3) # bitwise AND
print(5 | 3) # bitwise OR
print(5 ^ 3) # bitwise XOR
print(~5) # bitwise NOT
print(5 << 1) # bitwise left shift
print(5 >> 1) # bitwise right shift

#Membership & Identity Operators    
print(5 in [1, 2, 3, 5]) # membership operator
print(5 not in [1, 2, 3, 5]) # membership operator
print(5 is 5) # identity operator
print(5 is not 5) # identity operator
print(5 is 3) # identity operator
print(5 is not 3) # identity operator
print(5 is 5.0) # identity operator
print(5 is not 5.0) # identity operator


