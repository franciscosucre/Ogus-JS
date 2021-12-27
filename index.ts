import {Application} from './application.ts';
import {Router} from "./router/router.ts";

const server = new Application({
    port: 8000,
    hostname: "0.0.0.0",
    requestHandler: (req, res) => router.handle(req, res)
})

server.use(async (req, res, next) => {
    try {
        if (next) {
            await next()
        }
    } catch (e) {
        console.error("An error has been handled", e)
        res.status(500).json({
            error: e.message
        })
    }
}).use(async (req, res, next) => {
    if (next) {
        await next()
    }
    console.log("Middleware 1. I Should not appear if an error")
}).use(async (req, res, next) => {
    console.log("Middleware 2. I should appear")
    next ? await next() : null
})

const router = new Router().use((req, res, next) => {
    console.log('i am a route middleware')
    console.log('query: ', req.query)
}).get('/user/:id/', (req, res) => {
    res.json({
        id: req.params.id
    })
})

await server.listen(() => {
    console.log(`Listening on http://${server.hostname}:${server.port}`)
})
