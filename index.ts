import {Application} from './application.ts';

const server = new Application({port: 8000, hostname: "0.0.0.0"})

server.use(async (req, res, next) => {
    try {
        if (next) {
            await next()
        }
    } catch (e) {
        console.error("An error has been handled", e)
    }
}).use(async (req, res, next) => {
    if (next) {
        await next()
    }
    console.log("Middleware 1. I Should not be runned")
}).use(async (req, res, next) => {
    console.log("Middleware 2. I should appear")
    next ? await next(): null
})

await server.listen((req, res) => {
    console.log("listener!")
    throw new Error("ERROR")
})
