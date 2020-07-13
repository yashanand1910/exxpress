import { exxpress } from './exxpress';
import { createServer } from 'http';

const app = exxpress();
const server = createServer();

app.use('/', (req, res) => {
	console.log(req.url);
	res.write('Welcome BASE! \n');
});

app.use('/home', (req, res) => {
	console.log('HOME');
	res.write('HOME \n');
});

app.use('/home/about', (req, res) => {
	console.log('HOME - ABOUT');
	res.write('HOME - ABOUTPAGE \n');
});

app.use('/home/:ID', (req, res) => {
	console.log(`HOME - ${req.params['ID']}`);
	res.write(`HOME - ${req.params['ID']} \n`);
});

app.use('/home/:ID/about', (req, res) => {
	console.log(`HOME - ${req.params['ID']} - ABOUT`);
	res.write(`HOME - ${req.params['ID']} - ABOUT \n`);
});
