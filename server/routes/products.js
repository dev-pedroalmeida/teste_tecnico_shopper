const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    res.json({'products': 'Hello world'});
});

router.post('/validatePrices', (req, res) => {
    res.send(req.body);
})

module.exports = router;