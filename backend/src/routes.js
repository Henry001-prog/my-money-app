const express = require('express');


// Definir URL base para todas as rotas
const router = express.Router();
//server.use('/api', router);

// Rotas de Ciclo de Pagamento
const BillingCycle = require('./controllers/billingCycleService');

router.post('/billingCycles', BillingCycle.store);
router.get('/billingCycles', BillingCycle.index);
router.get('/billingCycles/:id', BillingCycle.show);
router.put('/billingCycles/:id', BillingCycle.update);
router.delete('/billingCycles/:id', BillingCycle.destroy);
router.get('/count', BillingCycle.count);
router.get('/summary', BillingCycle.summary);

module.exports = router;