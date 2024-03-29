import { Application, Router } from 'ogus-js';
import { Status } from 'deno/http/http_status.ts';

const router = new Router().use((req, res, next) => {
	console.log('i am a route middleware');
}).get('/user/:id/', (req, res) => {
	res.json({
		id: req.params.id,
	});
});

export const server = new Application({
	port: 8000,
	hostname: '0.0.0.0',
	requestHandler: (req, res) => router.handle(req, res),
});

server.use(async (req, res, next) => {
	try {
		if (next) {
			await next();
		}
	} catch (e) {
		console.error('An error has been handled', e);
		res.status(Status.InternalServerError).json({
			error: e.message,
		});
	}
}).use(async (req, res, next) => {
	if (next) {
		await next();
	}
	console.log('Middleware 1. I Should not appear if an error');
}).use(async (req, res, next) => {
	console.log('Middleware 2. I should appear');
	next ? await next() : null;
});
