const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./connection');

const indexRouter = require('./controllers/index');
const usersRouter = require('./controllers/users');
const itemsRouter = require('./controllers/items');
const OrdersRouter = require('./controllers/orders');
const privateRouter = require('./controllers/private');
const getviewsRouter = require('./controllers/getviews');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const jwt  = require('jsonwebtoken');
const User = require('./models/User');
const { mongoosesToObject } = require('./util/mongoose');
const { multipleMongooseToObject } = require('./util/mongoose');
const JWT_SECRET = 'ProjectI';
const Order = require('./models/Order');

const userMiddaleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next(new Error('Invalid token'));
    const token = authorizationHeader.split(' ')[1];
    const id = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id)
      .then(user => {
        req.user = mongoosesToObject(user);
        return next();
      })
      .catch(err => {
        return (err);
      });
  }
  catch (err) {
    return res.json({status: 'err'});
  }
}
const adminMiddaleware =  (req, res, next) => {
  if (req.user.role === 'admin') next();
  else return next(new Error('Do not permission'));
}

//connect db
db.connect();

var app = express();

app.use(express.static(path.join(__dirname,'')));

//method-override
app.use(methodOverride('_method'));

// view engine setup
app.engine(
  'hbs',
  exphbs({
      extname: 'hbs',
      helpers: {
          sum: ((a, b) => a+b),
          price: ((a, b) => {
            var c = a * b / 100;
            return a - c;
          }),

          printfprice : (a => {
            var s="";
            while (Math.floor(a / 1000) > 0) {
              var t = a % 1000;
              var snow = String(t);
              while (snow.length < 3) snow = "0" + snow;
              s = "." + snow + s;
              a = Math.floor(a / 1000);
            }
            return String(a) + s;
          })
      }
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/items', itemsRouter);
app.use('/users', usersRouter);
app.use('/', getviewsRouter);
app.use('/private', userMiddaleware, privateRouter);
app.use('/orders', userMiddaleware, OrdersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;