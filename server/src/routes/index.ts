import express from 'express';

import db from '../models/items';

export const router = express.Router();

/**
 * Function takes in a Date object and returns the day of the week in a text format.
 */
// const getWeekDay = function (date: Date) {
//   const weekdays = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//   ];
//   const day = date.getDay();
//   return weekdays[day];
// };

/*
 * Options key examples:
 *    day:
 *        The representation of the day.
 *        Possible values are "numeric", "2-digit".
 *    weekday:
 *        The representation of the weekday.
 *        Possible values are "narrow", "short", "long".
 *    year:
 *        The representation of the year.
 *        Possible values are "numeric", "2-digit".
 *    month:
 *        The representation of the month.
 *        Possible values are "numeric", "2-digit", "narrow", "short", "long".
 *    hour:
 *        The representation of the hour.
 *        Possible values are "numeric", "2-digit".
 *    minute:
 *        The representation of the minute.
 *        Possible values are "numeric", "2-digit".
 *    second:
 *        The representation of the second.
 *        Possible values are "numeric", 2-digit".
 */
// const formatDate = (date: Date, separator: string) => {
//   const options = [
//     { day: 'numeric' },
//     { month: 'short' },
//     { year: 'numeric' },
//   ] as const;

//   return options
//     .map(option => new Intl.DateTimeFormat('en', option).format(date))
//     .join(separator);
// };

/* GET home page. */
router.get('/', (req, res, next) => {
  const today = new Date();
  // const weekDay = getWeekDay(today);
  const day = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  res.render('list', { listTitle: day, items: db });
});

router.post('/', (req, res) => {
  const item = req.body.newItem;

  db.push(item);
  res.redirect('/');
});

export default router;
