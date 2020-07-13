import { IncomingMessage, ServerResponse } from 'http';

export class MiddlewareMap {
	baseURL: string;
	middlewares: Middleware[];
	childMiddlewareMaps: MiddlewareMap[];

	constructor(baseURL?: string) {
		this.baseURL = baseURL ? baseURL : '';
		this.middlewares = [];
		this.childMiddlewareMaps = [];
	}

	addMiddleware(URLPieces: string[], middleware: Middleware): void {
		if (URLPieces.length === 1 && URLPieces[0] === this.baseURL) {
			this.middlewares.push(middleware);
			return;
		}

		let childMiddlewareMap;
		for (let i = 0; i < this.childMiddlewareMaps.length; i++) {
			if (this.childMiddlewareMaps[i].baseURL === URLPieces[1]) {
				childMiddlewareMap = this.childMiddlewareMaps[i];
				break;
			}
		}
		if (!childMiddlewareMap) {
			childMiddlewareMap = new MiddlewareMap(URLPieces[1]);
			this.childMiddlewareMaps.push(childMiddlewareMap);
		}

		URLPieces.splice(0, 1);
		childMiddlewareMap.addMiddleware(URLPieces, middleware);
	}
}

export type Middleware = (request: Request, response: ServerResponse, next: () => void) => void;

export interface Request extends IncomingMessage{
	params?: any;
	query?: any;
}
