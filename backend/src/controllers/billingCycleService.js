const mongoose = require('mongoose');
const express = require('express');
//const errorHandler = require('../common/errorHandler');
const _ = require('lodash');

const BillingCycle = mongoose.model('BillingCycle');

module.exports = {
    async index(req, res) {
        const { page = 1 } = req.query;
        const billingCycles = await BillingCycle.paginate({}, { page, limit: 10 });
        
        return res.json(billingCycles);
    },

    async show(req, res) {
        const billingCycle = await BillingCycle.findById(req.params.id);

        return res.json(billingCycle);
    },

    async store(req, res, next) {
        try {
            const billingCycle = await BillingCycle.create(req.body);
        
            res.json(billingCycle);
            
        } catch (billingCycle) {
            //const message = billingCycle.errors.message;
            const parseErrors = async (nodeRestErrors) => {
                const errors = [];
                await _.forIn(nodeRestErrors, error => errors.push(error.message));
                return errors;
            }
            
            //const bundle = await res.errors;
            //console.log(billingCycle.errors)
            if (billingCycle.errors) {
                const errors = await parseErrors(billingCycle.errors);
                console.log(errors)
                return res.status(500).json({errors});
            } else {
                next();
            }
            //console.log(res.json(billingCycle.message))
            //const message = res.json(billingCycle);
            //errorHandler(message);
        }
    },

    async update(req, res) {
        try {
            const billingCycle = 
            await BillingCycle.findByIdAndUpdate(
                req.params.id, req.body, {new: true, runValidators: true }
            );
            
            return res.json(billingCycle);

        } catch (billingCycle) {
            const parseErrors = async (nodeRestErrors) => {
                const errors = [];
                await _.forIn(nodeRestErrors, error => errors.push(error.message));
                return errors;
            }
            
            //const bundle = await res.errors;
            //console.log(billingCycle.errors)
            if (billingCycle.errors) {
                const errors = await parseErrors(billingCycle.errors);
                console.log(errors)
                return res.status(500).json({errors});
            } else {
                next();
            }
        }
    },

    async destroy(req, res) {
        await BillingCycle.findByIdAndRemove(req.params.id);

        return res.send();
    },

    async count(req, res) {
        BillingCycle.count((error, billingCycles) => {
            if(error) {
                res.status(500).json({errors: [error]});
                //res.status(500).send('Erro desconhecido!');
            } else {
                res.json({billingCycles});
            }
        });
    },

    async summary(req, res) {
        BillingCycle.aggregate([{
            $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}}
        }, {
            $group: {_id: null, credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
        }, {
            $project: {_id: 0, credit: 1, debt: 1}
        }], (error, result) => {
            if(error) {
                res.status(500).json({errors: [error]});
                //res.status(500).send('Erro desconhecido!');
            } else {
                res.json(result[0] || { credit: 0, debt: 0 });
            }
        });
    }
}