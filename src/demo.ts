import { exxpress } from './exxpress';
import { ServerResponse } from 'http';
import { Request } from './middleware';

const app = exxpress();

app.use('/', (req: Request, res: ServerResponse) => {
	console.log(req.url);
	res.write('Welcome BASE! \n');
});

app.use('/home', (req: Request, res: ServerResponse) => {
	console.log('HOME');
	res.write('HOME \n');
});

app.use('/home/about', (req: Request, res: ServerResponse) => {
	console.log('HOME - ABOUT');
	res.write('HOME - ABOUTPAGE \n');
});

app.use('/home/:ID', (req: Request, res: ServerResponse) => {
	console.log(`HOME - ${req.params['ID']}`);
	res.write(`HOME - ${req.params['ID']} \n`);
});

app.use('/home/:ID/about', (req: Request, res: ServerResponse) => {
	console.log(`HOME - ${req.params['ID']} - ABOUT`);
	res.write(`HOME - ${req.params['ID']} - ABOUT \n`);
});

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});
