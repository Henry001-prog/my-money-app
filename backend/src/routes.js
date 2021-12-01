const express = require('express');


// Definir URL base para todas as rotas
const router = express.Router();
const auth = require('./config/auth');
//server.use('/api', router);

// Rotas de Ciclo de Pagamento
const BillingCycle = require('./controllers/billingCycleService');
const AuthService = require('./controllers/authService');

const protectedApi = express.Router();
protectedApi.use(auth);

router.post('/api/billingCycles', protectedApi, BillingCycle.store);
router.get('/api/billingCycles', protectedApi, BillingCycle.index);
router.get('/api/billingCycles/:id', protectedApi, BillingCycle.show);
router.put('/api/billingCycles/:id', protectedApi, BillingCycle.update);
router.delete('/api/billingCycles/:id', protectedApi, BillingCycle.destroy);
router.get('/api/count', protectedApi, BillingCycle.count);
router.get('/api/summary', protectedApi, BillingCycle.summary);


// router.get('/oapi/login', (req, res) => {return res.send('Hello World')});
router.post('/oapi/login', AuthService.login);
router.post('/oapi/signup', AuthService.signup);
router.post('/oapi/validateToken', AuthService.validateToken);

module.exports = router;