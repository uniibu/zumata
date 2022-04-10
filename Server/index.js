import app from './source/app.js';
import config from './config.js';

const port = config.service.port || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})