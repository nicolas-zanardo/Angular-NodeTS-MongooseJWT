import { Router } from 'express';
import {auth} from './auth';

export const index = Router();

index.use('/api/auth', auth);
