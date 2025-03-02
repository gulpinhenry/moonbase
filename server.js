const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const setTrendingStocks = require('./utils/trend-interval');
// const finnhub = require('finnhub');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'TO THE MOOOON',
    cookie: {maxAge: 3600000},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({ db: sequelize })
}

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
});

// setInterval(setTrendingStocks.setHourlyTrendingStocks, 3600000);
// setTrendingStocks.setHourlyTrendingStocks();