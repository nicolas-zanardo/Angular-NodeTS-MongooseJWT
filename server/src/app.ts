import express, {Express, Request, Response} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";

const app: Express = express();
const env = require(`./environment/${process.env.NODE_ENV}`);


mongoose.connect(env.dbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true
    }, (err:any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Connection DB Ok !');
        console.log(env.status);
      }
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = app;
