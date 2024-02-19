const apiRoutes = require('./apiRoutes');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = require('./settings');
const user = require('./routes/user');
const category = require('./routes/category');
const analytic = require('./routes/analytic');
const analyticByCategory = require('./routes/analyticByCategory');
const analyticByKeywordGroup = require('./routes/analyticByKeywordGroup');

const analyticApi = require('./routes/api/analytic');
const analyticByKeywordGroupApi = require('./routes/api/analyticByKeywordGroup');

const PORT = 8001;

app.use('/', user)
app.use('/usuario', user);
app.use('/categoria', category);
app.use('/analytic', analytic);
app.use('/analytic/by-category/', analyticByCategory);
app.use('/analytic/by-keywords/', analyticByKeywordGroup);

// API ROUTES
// app.use('/api/analytic/by-keywords/', analyticByKeywordGroupApi)
// app.use('/api/analytic/', analyticApi)
app.use('', apiRoutes);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(PORT, () => {
    console.log('Aplicação rodando no endereço: http://localhost:%s/', PORT)
});