import axios from "axios";
import { useEffect, useState } from "react";
import './ProductsList.css';


function ProductsList() {

	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios.get('http://127.0.0.1:3000/products/')
		.then(res => {
			console.log(res.data);
			setProducts(res.data);
		})
		.catch(err => {
			console.log(err);
		})
	}, [])

	return (
		<div className="products-list">
			<h2>Lista de Produtos</h2>

			{products.length > 0 ? 
			<table className="products-table">
				<thead>
					<tr>
						<th>Cód</th>
						<th>Nome</th>
						<th>Preço de Custo</th>
						<th>Preço de Venda</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((prod) =>
						<tr key={prod.code}>
							<td>{prod.code}</td>
							<td>{prod.name}</td>
							<td>{prod.cost_price}</td>
							<td>{prod.sales_price}</td>
						</tr>
					)}
				</tbody>
			</table>
			:
			<p>Nenhum produto encontrado</p>
			}

		</div>
	)
}

export default ProductsList