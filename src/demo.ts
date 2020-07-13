import { exxpress } from './exxpress';
import { ServerResponse } from 'http';
import { Request } from './middleware';

const app = exxpress();

app.use('/', (req: Request, res: ServerResponse, next) => {
	console.log(req.url);
	res.write('Welcome BASE! \n');
	next();
});

app.use('/home', (req: Request, res: ServerResponse, next) => {
	console.log('HOME');
	res.write('HOME \n');
	next();
});

app.use('/home/about', (req: Request, res: ServerResponse, next) => {
	console.log('HOME - ABOUT');
	res.write('HOME - ABOUTPAGE \n');
	next();
});

app.use('/home/:ID', (req: Request, res: ServerResponse, next) => {
	console.log(`HOME - ${req.params['ID']}`);
	res.write(`HOME - ${req.params['ID']} \n`);
	next();
});

app.use('/home/:ID/about', (req: Request, res: ServerResponse, next) => {
	console.log(`HOME - ${req.params['ID']} - ABOUT`);
	res.write(`HOME - ${req.params['ID']} - ABOUT \n`);
	next();
});

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});

// import * as express from 'express';

// const app2 = express();

// app2.use('/', (req: Request, res, next) => {
// 	console.log(req.url);
// 	res.write('Welcome BASE! \n');
// 	next();
// });

// app2.use('/home', (req: Request, res, next) => {
// 	console.log('HOME');
// 	res.write('HOME \n');
// 	next();
// });

// app2.use('/home/about', (req: Request, res, next) => {
// 	console.log('HOME - ABOUT');
// 	res.send('HOME - ABOUTPAGE \n');
// 	next();
// });

// app2.use('/home/:ID', (req: Request, res, next) => {
// 	console.log(`HOME - ${req.params['ID']}`);
// 	res.send(`HOME - ${req.params['ID']} \n`);
// 	next();
// });

// app2.use('/home/:ID/about', (req: Request, res, next) => {
// 	console.log(`HOME - ${req.params['ID']} - ABOUT`);
// 	res.send(`HOME - ${req.params['ID']} - ABOUT \n`);
// 	next();
// });

// app2.listen(3000, () => {
// 	console.log('Listening on port 3000...');
// });
