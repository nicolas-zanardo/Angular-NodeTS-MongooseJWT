import express, {Express, Request, Response} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

const app: Express = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = app;
