import { flow, pipe } from "fp-ts/lib/function";

console.log("Hello, world!🎉")

function len(str: string): number {
    return str.length
}

function double(number: number): number { 
    return number * 2
}

function sum(nums: number[]): number { 
    return nums.reduce((sum, num) => sum + num, 0) 
}

function join(char: string) {
    return (strs: string[]): string => strs.join(char)
}

const testArray = ["I'm", "a", "little", "teapot"]

const result = double(sum(testArray.map(len).map(double)))

const array = {
    map: <A, B>(fn: (value: A) => B) => (arr: A[]): B[] => arr.map(fn)
}

const result2 = pipe(
    testArray,
    array.map(len),
    array.map(double),
    sum,
    double,
    (num: number) => num.toString()
)

const result3 = flow(
    array.map(len),
    array.map(double),
    flow(sum, double)
)

console.log(result2)
console.log(result3(testArray))

(input) => triple(double(sum(input))
flow(sum, double, triple)
pipe(input, sum, double, triple)
