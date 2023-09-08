import axios from 'axios';
import { useState } from 'react';
import Papa from 'papaparse';

function ValidateForm() {

  const [newPrices, setNewPrices] = useState({});
  const [productsRes, setProductsRes] = useState([]);
  const [error, setError] = useState('');

  function parseFile(file) {
    Papa.parse(file, { 
      delimiter: ',', 
      header: true, 
      complete: function(results) {
        setNewPrices(results.data);
      } 
    })
  }

  function handleFileChange(e) {
    setError('');

    if(e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];

      if(fileExtension === 'csv') {
        parseFile(inputFile);
        
      } else {
        setError('Insira um arquivo csv!');
      }

    } else {
      setError('Insira um arquivo!');
    }
  }

  
  async function validatePrices() {
    setError('');
    if(!newPrices) {
      setError('Insira um arquivo válido!');
      return;
    }
    
    await axios.post('http://127.0.0.1:3000/products/validatePrices', newPrices)
    .then(res => {
      console.log(res);
      setProductsRes(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
        ValidateForm
        <form>
          <input type="file" name="novosPrecos" id="novosPrecos" onChange={handleFileChange} />    
          <button type="button" onClick={validatePrices}>Validar</button>
        </form>
        {
          error !== '' ? 
          <p>{error}</p>
          :
          <></>
        }

        {
          productsRes.length > 0 ?
          (
            <div>
              <h2>Produtos</h2>
              {productsRes.map((prod) => <p key={prod.product_code}>{prod.new_price}</p> )}
            </div>
          )
          : <></>
        }
    </div>
  )
}

export default ValidateForm