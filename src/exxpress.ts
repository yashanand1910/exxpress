import { MiddlewareMap, Middleware, Request } from './middleware';
import { IncomingMessage, ServerResponse, RequestListener } from 'http';
import { getPiecesFromURL } from './helper';

export function exxpress() {
	const exxpressMain = new ExxpressMain();

	return {}, (req, res) => {
		exxpressMain.process(req, res);
	};
}

export class ExxpressMain {
	private middlewareMap: MiddlewareMap;

	constructor() {
		// Initialize middleware maps
		this.middlewareMap = new MiddlewareMap();

		// TODO implement some default middlewares
		// TODO add default middlewares to the map here
	}

	process(request: IncomingMessage, response: ServerResponse): void {
		const middlewares = this.getMiddlewares(getPiecesFromURL(<string>request.url), [this.middlewareMap], request);
		middlewares.forEach(middleware => {
			middleware(request, response);
		});
		response.end();
	}

	getMiddlewares(URLPieces: string[], middlewareMaps: MiddlewareMap[], request: Request): Middleware[] {
		let middlewares: Middleware[] = [];

		for (let i = 0; i < middlewareMaps.length; i++) {
			if (this.processURLPieces(URLPieces[0], middlewareMaps[i].baseURL, request)) {
				URLPieces.splice(0, 1);
				middlewares = middlewares.concat(middlewareMaps[i].middlewares);
				if (URLPieces.length) {
					if (middlewareMaps[i].baseURL === '**') {
						const baseURLs = [];
						for (let j = 0; j < middlewareMaps[i].childMiddlewareMaps.length; j++) {
							baseURLs.push(middlewareMaps[i].childMiddlewareMaps[j].baseURL);
						}
						for (let j = 0; j < URLPieces.length; j++) {
							const index = baseURLs.indexOf(URLPieces[j]);
							if (index > -1) {
								middlewares = middlewares.concat(this.getMiddlewares(URLPieces.splice(0, j), [middlewareMaps[i].childMiddlewareMaps[index]], request));
								break;
							}
						}
					} else {
						middlewares = middlewares.concat(this.getMiddlewares(URLPieces, middlewareMaps[i].childMiddlewareMaps, request));
					}
				}
			}
		}

		return middlewares;
	}

	processURLPieces(URLPiece: string, StoredURLPiece: string, request: Request): boolean {
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
