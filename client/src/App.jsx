import './App.css'
import Navbar from './components/Navbar'
import ProductsList from './components/ProductsList'
import ValidateForm from './components/ValidateForm'

function App() {

  return (
    <>
      <Navbar />
      <div className='products'>
        <ProductsList />
        <ValidateForm />
      </div>
    </>
  )
}

export default App
