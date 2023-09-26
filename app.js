export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers'
  };

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.set({...CORS});
    next();
  });

  app.get('/login/', (req, res) => res.send('zdarya'));

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const input = req.params.input;
    const sha1Hash = crypto.createHash('sha1').update(input).digest('hex');
    res.send(sha1Hash);
  });

  app.all('/req/', (req, res) => {
    const addr = req.query.addr || req.body.addr;
    
    if (!addr) return res.send('Specify the "addr" parameter');

    http.get(addr, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => req.send(data));
    }).on('error', err => res.send(`ERROR ${err.message}`));
  });

  app.all('*', (req, res) => res.send('zdarya'));

  return app;
}