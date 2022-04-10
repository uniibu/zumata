'use strict'

import routes from './catfacts.js';
import { Router } from 'express';

// Import routes

const router = Router({
  caseSensitive: true
})

router.use('/api', routes);

export default router;