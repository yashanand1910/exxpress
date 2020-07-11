import { Exxpress } from './exxpress';

const app = new Exxpress();
app.listen(3000);

app.use('/', (req, res) => {
	console.log(req.url);
	res.write('Welcome BASE! \n');
});

app.use('/home', (req, res) => {
	console.log('HOME');
	res.write('HOME \n');
});

// Defining this before /home/:ID matters! Otherwise 'about' will be treated as a parameter
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

app.use('/home/:ID/about/:var1-:var2/', (req, res) => {
	console.log(`HOME - ${req.params['ID']} - ABOUT`);
	res.write(`HOME - ${req.params['ID']} - ABOUT \n`);
});

app.use('/home/**/version', (req, res) => {
	console.log('HOME - ** VERSION');
	res.write('HOME - ** VERSION \n');
});
