import { server } from './application.ts';

await server.listen(() => {
	console.log(`Listening on http://${server.hostname}:${server.port}`);
});
