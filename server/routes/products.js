const express = require('express');
const router = express.Router();
require('dotenv').config();

const db = require('mysql');
const connection = db.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if(err) {
            res.status(300).json(err);
        }
        res.json(results);
    })
});

router.post('/validatePrices', (req, res) => {
    const newPrices = req.body;
    let validatedPrices = [];
    
    connection.query('SELECT * FROM products', (err, results) => {
        if(err) { res.status(300).json(err) }
        const dbProducts = JSON.parse(JSON.stringify(results));

        newPrices.forEach((newPrice, index) => {
            validatedPrices.push(newPrice);
            validatedPrices[index].errors = [];

            let dbProd = JSON.parse(JSON.stringify(dbProducts.find((prod) => prod.code == newPrice.product_code) || {}));
            validatedPrices[index].current_price = dbProd.sales_price;
            validatedPrices[index].name = dbProd.name;
    
            if(newPrice.product_code && newPrice.new_price) {
                const validCode = dbProducts.some((prod) => prod.code == newPrice.product_code);
                
                if(validCode) {

                    if(newPrice.new_price > dbProd.cost_price) {

                        if(+(dbProd.sales_price - newPrice.new_price) < (dbProd.sales_price * 0.10)) {
                            
                            connection.query('SELECT * FROM packs', (err, results) => {
                                if(err) { res.status(300).json(err) }
                                const dbPacks = JSON.parse(JSON.stringify(results));

                                const hasPackProduct = dbPacks.some((pack) => {
                                    pack.pack_id == newPrice.product_code
                                    &&
                                    dbProducts.some((prod) => prod.code == pack.product_id)
                                })

                                const hasProductPack = dbPacks.some((pack) => {
                                    pack.product_id == newPrice.product_code
                                })

                                if(hasPackProduct || hasProductPack) {

                                } else {
                                    validatedPrices[index].errors.push('É necessário atualizar o pacote e os produtos componentes!');
                                }
                            })
                        } else {
                            validatedPrices[index].errors.push('Reajuste não pode exceder 10% do preço atual!');
                        }
                    } else {
                        validatedPrices[index].errors.push('Novo preço precisa ser maior que o preço de custo!');
                    }
                } else {
                    validatedPrices[index].errors.push('Código inválido!');    
                }
            } else {
                validatedPrices[index].errors.push('Campos necessários não presentes!');
            }
    
        });
        res.send(validatedPrices);
    })
})

router.put('/', (req, res) => {
    const newPrices = req.body;

    newPrices.forEach((newPrice) => {
        connection.query(`UPDATE products SET sales_price=${newPrice.new_price} WHERE code=${newPrice.product_code}`, (err, results) => {
            if(err) { res.status(300).json(err) }
        })
    })

});

module.exports = router;