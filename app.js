const app = require('./settings');
const user = require('./routes/user');
const clientProfile = require('./routes/clientProfile');
const instagramAccount = require('./routes/instagramAccount');
const expansion = require('./routes/expansion');
const expansionByProfile = require('./routes/expansionByProfile');
const expansionByCategory = require('./routes/expansionByCategory');
const category = require('./routes/category');
const analyticByKeywords = require('./routes/analyticByKeywords');
const analyticByProfile = require('./routes/analyticByProfile');

const PORT = 8001;

app.use('/usuario', user);
app.use('/usuario/perfil', clientProfile);
app.use('/conta-instagram', instagramAccount);
app.use('/expansao', expansion);
app.use('/expansao-categoria', expansionByCategory);
app.use('/expansao-perfis', expansionByProfile);
app.use('/categoria', category);
app.use('/analytic-perfis', analyticByProfile);
app.use('/analytic-palavras-chaves', analyticByKeywords);

app.listen(PORT, () => {
    console.log('Aplicação rodando no endereço: http://localhost:%s/', PORT)
});