const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const productsRoutes = require('./routes/products')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/products', productsRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

