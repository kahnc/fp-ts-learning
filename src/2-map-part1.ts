import axios, { AxiosResponse } from 'axios'
import { either } from 'fp-ts/lib/Either'
import { pipe } from "fp-ts/lib/function"
import { add, boundScore, double, len, sum } from './utils'

// https://prod.liveshare.vsengsaas.visualstudio.com/join?9877BD5BFBF9B9CFD14CB50D88764382069F

// Pipeline proposal: https://github.com/tc39/proposal-pipeline-operator
//
// let person = { score: 25 };
// let newScore = person.score
//   |> double
//   |> (_ => add(7, _))
//   |> (_ => boundScore(0, 100, _));

function arrayMap<A, B>(fn: (a: A) => B) {
    return (as: A[]): B[] => as.map(fn)
}

function promiseMap<A, B>(fn: (a: A) => B) {
    return (ap: Promise<A>): Promise<B> => ap.then(fn)
}

function promiseChain<A, B>(fn: (a: A) => Promise<B>) {
    return (ap: Promise<A>): Promise<B> => ap.then(fn)
}

type Left<E> = { left: E, __tag: "Left" }
type Right<A> = { right: A, __tag: "Right" }
type Either<E, A> = Left<E> | Right<A>

function Right<A>(right: A) { return { __tag: "Right" as const, right }}
function Left<E>(left: E) { return { __tag: "Left" as const, left }}

function isRight<E, A>(either: Either<E, A>): either is Right<A> {
    return either.__tag === "Right"
}
function isLeft<E, A>(either: Either<E, A>): either is Left<E> {
    return either.__tag === "Left"
}

function eitherMap<E, A, B>(fn: (a: A) => B) {
    return (either: Either<E, A>): Either<E, B> => {
        if (isLeft(either)) {
            return either
        }
        const newValue = fn(either.right)
        return Right(newValue)
    }
}

function eitherChain<E, A, B>(fn: (a: A) => Either<E, B>) {
    return (either: Either<E, A>): Either<E, B> => {
        if (isLeft(either)) {
            return Left(either.left);
        }
        return fn(either.right)
    }
}

function divide(x: number) {
    return (y: number): Either<string, number> => {
        if (y === 0) {
            return Left("Tried to divide by 0")
        }
        return Right(x / y)
    }
}

async function main() {
    console.log("Running...")

    // type User = { id: number; name: string; email: string }
    // type Post = { id: number; title: string; body: string }

    // function getData<D>(response: AxiosResponse<D>): D {
    //     return response.data;
    // }

    // // so clean :)
    // const result2 = pipe(
    //     axios.get<User>("https://jsonplaceholder.typicode.com/users/1"), // Promise<AxiosResponse<User>>
    //     promiseMap(getData), // Promise<User>
    //     promiseChain((uswer) => axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)),
    //     promiseMap(getData),
    //     promiseMap(arrayMap(post => post.title))
    // )
    // console.log("Result 2: ", await result2);

    const result3 = pipe(
        3, // number
        divide(0), // Either<string, number>
        eitherMap(double), // Either<string, number>
        eitherChain(divide(10)),
        eitherMap(result => `${result.toString()}!!!`), // Either<string, string>
    )
    
    if (isRight(result3)) {
        console.log("Good result", result3.right)
    }
    else {
        console.error("Bah!", result3.left)
    }

    console.log("Finished.")
}

main()
