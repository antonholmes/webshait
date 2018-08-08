import path from 'path';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import socketio from 'socket.io';
import { userInfo } from 'os';

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 4321;
const app = express();

module.exports = app;

if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions());
}

if (process.env.NODE_ENV === 'production') require('../secrets');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // Logging
  app.use(morgan('dev'));
  // Body Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Compression
  app.use(compression());
  // Session with Passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'you will not find this anyway',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // Auth and API routes
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));
  // Static File-Serving
  app.use(express.static(path.join(__dirname, '..', 'public')));
  // Request Error Handling
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });
  // Index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });
  // Error Handling Endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`Site served on port ${PORT}`)
  );
  const io = socketio(server);
  require('./socket')(io);
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
