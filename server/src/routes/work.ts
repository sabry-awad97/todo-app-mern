import express from 'express';
const router = express.Router();

import db from '../models/workItems';

router.get('/', (req, res, next) => {
  res.render('list', { listTitle: 'Work List', items: db });
});

router.post('/', (req, res) => {
  const item = req.body.newItem;
  db.push(item);
  res.redirect('/work');
});

export default router;
