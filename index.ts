import {Application} from './application.ts';
import {Router} from "./router/router.ts";

const server = new Application({port: 8000, hostname: "0.0.0.0"})

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

const router = new Router().get('/user/:id/', (req, res) => {
    res.json({
        id: req.params.id
    })
})

await server.listen(async (req, res) => {
    const match = router.match(req.method, req.url)
    if (!match) {
        throw new Error("Route not found")
    }
    const {route, params} = match
    req.params = params
    await route.handle(req, res)
})
