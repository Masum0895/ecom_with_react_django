import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
function App(){
   
  return(
    <Router>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
      </Routes>
    </Router>
  );
}

export default App;
