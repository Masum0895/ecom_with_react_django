import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from "../components/navbar";
import CartPage from "../pages/CartPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CheckoutPage from "../pages/CheckoutPage";
import PrivateRouter from "../components/PrivateRouter";
function App(){
   
  return(
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route element={<PrivateRouter/>}>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
      </Routes>
    </Router>
  );
}

export default App;
