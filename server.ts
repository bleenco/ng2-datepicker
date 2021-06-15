import * as express from 'express';
import * as compression from 'compression';
import { join } from 'path';

const app = express();
const port = process.env.SERVER_PORT || 4075;

const index = (req: express.Request, res: express.Response) => {
  return res.status(200).sendFile(join(__dirname, 'demo', 'index.html'));
};

app.use(compression());
app.get('*.*', express.static(join(__dirname, 'demo'), { index: false }));
app.all('/*', index);

app.listen(port, () => console.log(`server running on http://localhost:${port}`));
