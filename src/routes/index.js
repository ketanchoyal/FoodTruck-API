import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializaDb from '../db';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';
// import app from '..';

let router = express();

//connect to db
initializaDb(db => {

    //internal middleware
    router.use(middleware({ config, db}));

    //api routes v1 (/v1)
    router.use('/foodtruck', foodtruck({ config, db }));
    router.use('/account',account({ config, db }));

});

export default router;
