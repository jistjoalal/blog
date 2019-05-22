---
title: "A Kata"
date: "2019-05-09"
---

[CodeWars](https://codewars.com) is a fun site for practicing programming skills. Any one can create a "Kata" (challenge) that is essentialy a set of tests for a program. You beat the kata by writing a program that passes all the tests.

CodeWars has a lot of martial arts analogies. Here is my badge after ~6 months of Katas. I am almost at the "black belt" level which would seriously impress 12 year old me--although I have yet to solve a "1 kyu", the most challenging kata. _Note:_ I have now, read about it [here](/blog/hard-problem).

![CodeWars Badge](https://www.codewars.com/users/jistjoalal/badges/large)

Someone actually asked for an explanation of one of my solutions for the first time, and I thought I would make a small blog post out of it.

## Spoilers

To avoid spoiling any desperate google searches, I'm omitting the title of this kata. It's just some weird math words anyways.

## The challenge

Our program is meant to find all solutions to a certain type of polynomial equation:

$$
x^2 - 4y^2 = n
$$

In programming terms, write a function with the following i/o:

### Input

- $n$: Integer

### Output

- $[[x_1, y_1], [x_2, y_2], ..., [x_i, y_i]]$: List of tuples, $x_i$ and $y_i$ that solve our equation.

## The solution

Factoring, we know

$$
x^2 - 4y^2 = (x - 2y)(x + 2y) = n
$$

Suppose $n = ab$, then $a$ and $b$ are both factors of $n$. So we can call $a = (x - 2y)$ and $b = (x + 2y)$. Because $n = ab$, then $b = n / a$. So now we have:

$$
a = (x - 2y)
$$

$$
n / a = (x + 2y)
$$

Solving for $x$ and $y$ in terms of $n$ and $a$ (factor of $n$):

$$
x = (a + n / a) / 2
$$

$$
y = (n / a - a) / 4
$$

So now we can loop through all the smaller factors of $n$ ($a$ is smaller than $b$ given the input constraints). We check if the $x$ and $y$ satisfy our definition of $b$. If it does, we append to result list.

Our program basically just searches for factors with the extra step of checking that this particular factor (and it's implicit pair) satisfy our equation.

```py
import math
def sol_equa(n):

    r = []

    # loop thru factors of n
    for i in range(1, int(math.sqrt(n)) + 1):

        # skip non-factors
        if n % i != 0: continue

        # equation check
        x = (i + n/i) // 2
        y = (n/i - i) // 4
        if (n/i == x + 2 * y): r.append([x,y])

    return r
```

## Conclusion

I still don't feel like I completely understand my solution to this problem, or even the problem itself. I'm reading Rosen's _Discrete Mathematics_ right now and seriously struggling. My plan was to sharpen my math chops to improve my programming. The outcome has been simply the realization that I have no idea how I've been solving programming problems. This kata (and the cool guy that asked me to explain it) were great practice for some of the concepts I'm studying.
