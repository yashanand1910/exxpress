import { MiddlewareMap, Middleware, Request } from './middleware';
import { IncomingMessage, ServerResponse, createServer, Server } from 'http';
import { getPiecesFromURL } from './helper';

export function exxpress(): ExxpressServer {
	const server = new ExxpressServer(new ExxpressMain());

	return server;
}

export class ExxpressServer {
	exxpressMain: ExxpressMain;
	server: Server

	constructor(exxpressMain: ExxpressMain) {
		this.exxpressMain = exxpressMain;
		this.server = createServer(this.exxpressMain.requestListener);
	}

	use(URL: string, middleware: Middleware): void {
		this.exxpressMain.use(URL, middleware);
	}

	listen(port: number, callback: () => void): void {
		this.server.listen(port, callback);
	}
}

export class ExxpressMain {
	middlewareMap: MiddlewareMap;

	constructor() {
		// Initialize middleware maps
		this.middlewareMap = new MiddlewareMap();

		// TODO implement some default middlewares
		// TODO add default middlewares to the map here
	}

	requestListener = (request: IncomingMessage, response: ServerResponse): void => {
		const middlewares = this.getMiddlewares(getPiecesFromURL(<string>request.url), [this.middlewareMap], request);
		
		this.callMiddleware(middlewares, 0, request, response);

		response.end();
	}

	callMiddleware = (middlewares: Middleware[], i: number, request: IncomingMessage, response: ServerResponse): void => {
		if (i >= middlewares.length) {
			return;
		}
		middlewares[i](request, response, () => this.callMiddleware(middlewares, i + 1, request, response));
	}

	getMiddlewares(URLPieces: string[], middlewareMaps: MiddlewareMap[], request: Request): Middleware[] {
		let middlewares: Middleware[] = [];

		if (!URLPieces.length) {
			return middlewares;
		}

		for (let i = 0; i < middlewareMaps.length; i++) {
			if (this.matchURLPieces(URLPieces[0], middlewareMaps[i].baseURL, request)) {
				middlewares = middlewares.concat(middlewareMaps[i].middlewares);
				if (middlewareMaps[i].baseURL === '**') {
					const baseURLs = [];
					for (let j = 0; j < middlewareMaps[i].childMiddlewareMaps.length; j++) {
						baseURLs.push(middlewareMaps[i].childMiddlewareMaps[j].baseURL);
					}
					for (let j = 1; j < URLPieces.length; j++) {
						const index = baseURLs.indexOf(URLPieces[j]);
						if (index > -1) {
							const newURLPieces = URLPieces.slice(j, URLPieces.length);
							middlewares = middlewares.concat(this.getMiddlewares(newURLPieces, [middlewareMaps[i].childMiddlewareMaps[index]], request));
							break;
						}
					}
				} else {
					const newURLPieces = URLPieces.slice(1, URLPieces.length);
					middlewares = middlewares.concat(this.getMiddlewares(newURLPieces, middlewareMaps[i].childMiddlewareMaps, request));
				}
			}
		}

		return middlewares;
	}

	matchURLPieces(URLPiece: string, StoredURLPiece: string, request: Request): boolean {
		if (StoredURLPiece.startsWith(':')) {
			if (!request.params) {
				request.params = {};
			}
			request.params[StoredURLPiece.split(':')[1]] = URLPiece;
			return true;
		} else if (StoredURLPiece === '**') {
			return true;
		} else {
			// TODO replace with proper regex match
			return URLPiece === StoredURLPiece;
		}
	}

	/**
	 * Middleware functions (GET, POST, USE)
	 *
	 * */

	use(URL: string, middleware: Middleware): void {
		this.middlewareMap.addMiddleware(getPiecesFromURL(URL), middleware);
	}
}
