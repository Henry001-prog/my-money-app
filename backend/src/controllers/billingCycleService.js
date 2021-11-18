const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');

const BillingCycle = mongoose.model('BillingCycle');

module.exports = {
    async index(req, res, next) {
        try {
            const { page = 1 } = req.query;
            const billingCycles = await BillingCycle.paginate({}, { page, limit: 10 });
        
            res.json(billingCycles);

        } catch (error) {
            res.status(500).json({Error: 'Não foi possível trazer os registros solicitados!'});
            next();
        }
    },

    async show(req, res, next) {
        try {
            const billingCycle = await BillingCycle.findById(req.params.id);

            return res.json(billingCycle);

        } catch (error) {
            res.status(500).json({Error: 'Não foi possível trazer o registro específico solicitado!'});
            next();
        }
    },

    async store(req, res, next) {
        try {
            const billingCycle = await BillingCycle.create(req.body);
        
            res.json(billingCycle);
            
        } catch (billingCycle) {
            const parseErrors = async (nodeRestErrors) => {
                const errors = [];
                await _.forIn(nodeRestErrors, error => errors.push(error.message));
                return errors;
            }
            
            if (billingCycle.errors) {
                const errors = await parseErrors(billingCycle.errors);
                console.log(errors)
                return res.status(500).json({errors});
            } else {
                next();
            }
        }
    },

    async update(req, res, next) {
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
            
            if (billingCycle.errors) {
                const errors = await parseErrors(billingCycle.errors);
                console.log(errors)
                return res.status(500).json({errors});
            } else {
                next();
            }
        }
    },

    async destroy(req, res, next) {
        try {
            await BillingCycle.findByIdAndRemove(req.params.id);

            return res.json({Success: 'Registro deletado com sucesso!'});

        } catch (error) {
            res.status(500).json({Error: 'Não foi possível deletar o registro solicitado!'});
            next();
        }
    },

    async count(req, res, next) {
        BillingCycle.count((error, billingCycles) => {
            if(error) {
                res.status(500).json({Error: 'Não foi possível trazer a quatidade de registros!'});
                next();
            } else {
                res.json({billingCycles});
            }
        });
    },

    async summary(req, res, next) {
        BillingCycle.aggregate([{
            $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}}
        }, {
            $group: {_id: null, credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
        }, {
            $project: {_id: 0, credit: 1, debt: 1}
        }], (error, result) => {
            if(error) {
                res.status(500).json({Error: 'Não foi possível trazer o sumário!'});
                next();
            } else {
                res.json(result[0] || { credit: 0, debt: 0 });
            }
        });
    }
}