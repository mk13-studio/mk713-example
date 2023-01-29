import express from 'express';
import bodyParser from 'body-parser';
import { emailProvider, databaseProvider } from 'mk713';
import { AWSDynamoDBProvider } from 'mk713-dynamo';
import { AWSSimpleEmailServiceEmailProvider } from 'mk713-email';

import { appRoute } from './routes';

import authentication_routes from './auth/route';
import library_routes from './library/route';
import account_routes from './account/route';

import { authService } from './auth/service';
import { libraryService } from './library/service';
import { accountService } from './account/service';

const app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    next();
});

databaseProvider.initialize(new AWSDynamoDBProvider(process.env.AWS_DYNAMO_DATABASE, process.env.AWS_DYNAMO_REGION));
emailProvider.initialize(new AWSSimpleEmailServiceEmailProvider(process.env.AWS_SES_SENDER, process.env.AWS_SES_REGION));

authService.init();
libraryService.init();
accountService.init();

app.use(authentication_routes);
app.use(library_routes);
app.use(account_routes);

const router = express.Router();

router.get(appRoute.getV1Url(appRoute.getMap().general.status), (request, response) =>{
    response.status(200);
    if (process.env.SECURE_DEPLOY) {
        response.json({
            'backend': request.hostname,
            'database': process.env.AWS_DYNAMO_DATABASE,
            'deploy': process.env.SECURE_DEPLOY,
            'port': process.env.PORT,
            'package': process.env.npm_package_version,
        });
    } else {
        response.json({
            'backend': request.hostname,
            'database': process.env.AWS_DYNAMO_DATABASE,
            'deploy': 'local',
            'port': process.env.PORT,
            'package': process.env.npm_package_version,
        });
    }
});

app.use(router);
app.use(function (req, res) {
    console.log(`404: ${req.method.toUpperCase()} ${req.url}`);
    res.status(404).json({ error: 'not found'});
});

const port = +process.env.PORT;

app.listen(port, () => {
    console.log(`MK713 Example API (version: ${process.env.npm_package_version}) started on port ${port}`);
});

