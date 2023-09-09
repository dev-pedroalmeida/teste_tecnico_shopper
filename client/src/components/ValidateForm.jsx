import axios from 'axios';
import { useState } from 'react';
import Papa from 'papaparse';
import './ValidateForm.css'

function ValidateForm() {

  const [newPrices, setNewPrices] = useState({});
  const [productsRes, setProductsRes] = useState([]);
  const [productsValid, setProductsValid] = useState(false);
  const [error, setError] = useState('');

  function parseFile(file) {
    Papa.parse(file, { 
      delimiter: ',', 
      header: true, 
      skipEmptyLines: true,
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
      if(!res.data.some(el => el.errors.length > 0)) setProductsValid(true)
      setProductsRes(res.data);

    })
    .catch(err => {
      console.log(err);
    })
  }

  async function updatePrices() {
    setError('');

    if(!newPrices) {
      setError('Insira um arquivo válido!');
      return;
    }
    
    await axios.put('http://127.0.0.1:3000/products/', newPrices)
    .then(res => {
      console.log(res);
      setNewPrices([]);
      setProductsRes([]);
      setProductsValid(false);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      <h2>Atualize os produtos</h2>
        <form className="val-form">
          <input type="file" name="novosPrecos" id="novosPrecos" onChange={handleFileChange} />

          <div>
            <button type="button" onClick={validatePrices}>Validar</button>
            <button type="button" className="secondary" disabled={!productsValid} onClick={updatePrices}>Atualizar</button>
          </div>
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
            <table className="val-table">
              <thead>
                <tr>
                  <th>Cód</th>
                  <th>Nome</th>
                  <th>Preço Atual</th>
                  <th>Novo Preço</th>
                  <th>Erros</th>
                </tr>
              </thead>
              <tbody>
                {productsRes?.map((prod) =>
                  <tr key={prod.product_code}>
                    <td>{prod.product_code || 'vazio'}</td>
                    <td>{prod.name || 'vazio'}</td>
                    <td>{prod.current_price || 'vazio'}</td>
                    <td>{prod.new_price || 'vazio'}</td>
                    <td>{prod.errors.map((error, index) => <p key={index}>{error}</p> )}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )
          : <></>
        }
    </div>
  )
}

export default ValidateForm