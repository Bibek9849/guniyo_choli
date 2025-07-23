import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/ProductCard.css'; // Ensure you create this CSS file and add the necessary styles

const ProductCard = ({ productInformation, color }) => {
    return (
        <div className="card product-card">
            <span
                style={{
                    backgroundColor: color,
                    border: color ? 'green' : 'none'
                }}
                className='badge position-absolute top-0'
            >
                {productInformation.productCategory}
            </span>

            <img 
                src={`http://localhost:5000/products/${productInformation.productImage}`} 
                className="card-img-top" 
                alt={productInformation.productName} 
            />
            <div className="card-body">
                <div className='d-flex justify-content-between'>
                    <h5 className="card-title">{productInformation.productName}</h5>
                    <h5 className="text-danger">{productInformation.productPrice}</h5>
                </div>
                <p className="card-text">{productInformation.productDescription.slice(0, 25)}</p>
                <Link to= {`/buynow/${productInformation._id}`} className="btn btn-outline-dark w-100">Buy Now</Link>
            </div>
        </div>
    );
}

export default ProductCard;
