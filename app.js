const app = require('./settings');
const user = require('./routes/user');
const category = require('./routes/category');
const analytic = require('./routes/analytic');
const analyticByCategory = require('./routes/analyticByCategory');
const analyticByKeywordGroup = require('./routes/analyticByKeywordGroup');

const PORT = 8001;

app.use('/', user)
app.use('/usuario', user);
app.use('/categoria', category);
app.use('/analytic', analytic);
app.use('/analytic/by-category/', analyticByCategory);
app.use('/analytic/by-keywords/', analyticByKeywordGroup);

app.listen(PORT, () => {
    console.log('Aplicação rodando no endereço: http://localhost:%s/', PORT)
});