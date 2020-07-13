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

app.use('/home/**/changelog', (req: Request, res: ServerResponse, next) => {
	console.log('HOME - CHANGELOG');
	res.write('HOME - CHANGELOG');
	next();
});

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});
