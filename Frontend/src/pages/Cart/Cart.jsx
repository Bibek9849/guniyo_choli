// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../CSS/Cart.css";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const updatedCart = cart.map((item) => ({
//       ...item,
//       quantity: item.quantity || 1,
//     }));
//     setCartItems(updatedCart);
//     calculateTotal(updatedCart);
//   }, []);

//   const calculateTotal = (cart) => {
//     const totalAmount = cart.reduce(
//       (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
//       0
//     );
//     setTotal(totalAmount);
//   };

//   const handleIncreaseQuantity = (index) => {
//     const updatedCart = [...cartItems];
//     updatedCart[index].quantity += 1;
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     calculateTotal(updatedCart);
//   };

//   const handleDecreaseQuantity = (index) => {
//     const updatedCart = [...cartItems];
//     if (updatedCart[index].quantity > 1) {
//       updatedCart[index].quantity -= 1;
//     } else {
//       updatedCart.splice(index, 1); // Remove the item if quantity is 0
//     }
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     calculateTotal(updatedCart);
//   };

//   const handleRemoveAll = () => {
//     setCartItems([]);
//     localStorage.removeItem("cart");
//     setTotal(0);
//   };

//   const handleProceedToPayment = () => {
//     navigate("/payment", { state: { cartItems, total } });
//   };

//   return (
//     <div className="cart-container">
//       <div className="cart-header">
//         <h1>Your Cart</h1>
//         {cartItems.length > 0 && (
//           <button className="clear-cart-btn" onClick={handleRemoveAll}>
//             Remove All
//           </button>
//         )}
//       </div>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <table className="cart-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Product Name</th>
//                 <th>Price</th>
//                 <th>Quantity</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>
//                     <img
//                       src={`http://localhost:5000/products/${item.productImage}`}
//                       alt={item.productName}
//                       className="cart-item-image"
//                     />
//                   </td>
//                   <td>{item.productName}</td>
//                   <td>Rs. {parseFloat(item.productPrice).toFixed(2)}</td>
//                   <td>
//                     <div className="quantity-control">
//                       <button
//                         className="decrease-btn"
//                         onClick={() => handleDecreaseQuantity(index)}
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         className="increase-btn"
//                         onClick={() => handleIncreaseQuantity(index)}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </td>
//                   <td>
//                     Rs.{" "}
//                     {(parseFloat(item.productPrice) * item.quantity).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <h2 className="total-amount">Total: Rs. {total.toFixed(2)}</h2>
//           <button className="proceed-btn" onClick={handleProceedToPayment}>
//             Pay
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  }, []);

  const calculateTotal = (cart) => {
    const totalAmount = cart.reduce(
      (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1); // Remove the item if quantity is 0
    }
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setTotal(0);
  };

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { cartItems, total } });
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        {cartItems.length > 0 && (
          <button className="clear-cart-btn" onClick={handleRemoveAll}>
            Remove All
          </button>
        )}
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`http://localhost:5000/products/${item.productImage}`}
                      alt={item.productName}
                      className="cart-item-image"
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>Rs. {parseFloat(item.productPrice).toFixed(2)}</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        className="decrease-btn"
                        onClick={() => handleDecreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="increase-btn"
                        onClick={() => handleIncreaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    Rs.{" "}
                    {(parseFloat(item.productPrice) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="total-amount">Total: Rs. {total.toFixed(2)}</h2>
          <button className="proceed-btn" onClick={handleProceedToPayment}>
            Pay
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
