import { IncomingMessage, ServerResponse } from 'http';

export class MiddlewareMap {
	baseURL: string;
	middlewares: Middleware[];
	requestHandlers: RequestHandlers;
	childMiddlewareMaps: MiddlewareMap[];

	constructor(baseURL?: string) {
		this.baseURL = baseURL ? baseURL : '';
		this.middlewares = [];
		this.childMiddlewareMaps = [];
		this.requestHandlers = {
			get: defaultRequestHandler,
			post: defaultRequestHandler
		};
	}

	addMiddleware(URLPieces: string[], middleware: Middleware, requestHandlerMethod: RequestHandlerMethod = 'NONE'): void {
		if (URLPieces.length === 1 && URLPieces[0] === this.baseURL) {
			if (requestHandlerMethod  == 'GET') {
				this.requestHandlers.get = <RequestHandler> middleware;
			} else if (requestHandlerMethod  == 'POST') {
				this.requestHandlers.post = <RequestHandler> middleware;
			} else {
				this.middlewares.push(middleware);
			}
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
		childMiddlewareMap.addMiddleware(URLPieces, middleware, requestHandlerMethod);
	}
}

export const defaultRequestHandler = (request: Request, response: ServerResponse): void => {
	// Add default handler here

	response.end();
};

export type RequestHandlers = {
	get: RequestHandler;
	post: RequestHandler;
};

export type RequestHandlerMethod =  'NONE' | 'GET' | 'POST';

export type RequestHandler = (request: Request, response: ServerResponse) => void;

export type Middleware = (request: Request, response: ServerResponse, next: () => void) => void;

export interface Request extends IncomingMessage{
	params?: any;
	query?: any;
}
