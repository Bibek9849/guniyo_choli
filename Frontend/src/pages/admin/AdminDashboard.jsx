import React, { useState, useEffect } from 'react';
import { createProductApi, deleteProduct, getAllProducts } from '../../apis/Api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSS/AdminDashboard.css';
import axios from 'axios';


const AdminDashboard = () => {
    // Logic for get products
    const [products, setProducts] = useState([]);

    // Hit API (Get all product) Auto -> useEffect (list of products)
    useEffect(() => {
        getAllProducts().then((res) => {
            const updatedProducts = res.data.products.map(product => ({
                ...product,
                accepted: false  // Initially set all products as not accepted
            }));
            setProducts(updatedProducts);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    // Making a state for product
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');

    // Image state
    const [productImage, setProductImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // function to upload and preview image
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProductImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    // Delete Product
    const handleDelete = (id) => {
        const confirmDialog = window.confirm("Are you sure you want to delete?");
        if (confirmDialog) {
            deleteProduct(id).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    setProducts(products.filter(product => product._id !== id));  // Remove deleted product from state
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    toast.error(error.response.data.message);
                } else if (error.response.status === 400) {
                    toast.error(error.response.data.message);
                }
            });
        }
    };

    // handle submit
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productCategory', productCategory);
        formData.append('productDescription', productDescription);
        formData.append('productImage', productImage);
        console.log(productImage);



        try {
            const res = await axios.post("http://localhost:5000/api/product/create",formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
            )
            if (res.status === 201) {
                toast.success(res.data.message);
                window.location.reload();
            } else {
                toast.error("Something went wrong in frontend");
            }
            
            
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else if (error.response.status === 500) {
                    toast.error("Internal Server error");
                }
            } else {
                toast.error("No response");
            }
        }

        // createProductApi(formData).then((res) => {
        //     if (res.status === 201) {
        //         toast.success(res.data.message);
        //         window.location.reload();
        //     } else {
        //         toast.error("Something went wrong in frontend");
        //     }
        // }).catch((error) => {
        //     if (error.response) {
        //         if (error.response.status === 400) {
        //             toast.error(error.response.data.message);
        //         } else if (error.response.status === 500) {
        //             toast.error("Internal Server error");
        //         }
        //     } else {
        //         toast.error("No response");
        //     }
        // });
    };

    // Function to handle acceptance toggle
    const handleAcceptanceToggle = (id) => {
        const updatedProducts = products.map(product => {
            if (product._id === id) {
                return {
                    ...product,
                    accepted: true  // Set accepted to true when toggled
                };
            }
            return product;
        });
        setProducts(updatedProducts);

        // Set timeout to remove the product after 2 seconds
        setTimeout(() => {
            setProducts(products.filter(product => product._id !== id));
        }, 2000);
    };

    return (
        <>
        
            <div className='container mt-4'>
                <div className='d-flex justify-content-between'>
                    <h2>Admin Dashboard</h2>
                    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#addProductModal">
                        Add Product
                    </button>
                </div>
                
                <div className="modal fade" id="addProductModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create a new product!</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label>Product Name</label>
                                        <input onChange={(e) => setProductName(e.target.value)} type="text" className='form-control' placeholder='Enter your product Name' />
                                    </div>
                                    <div className="mb-3">
                                        <label>Product Price</label>
                                        <input onChange={(e) => setProductPrice(e.target.value)} type="number" className='form-control' placeholder='Enter product price' />
                                    </div>
                                    <div className="mb-3">
                                        <label>Select Category</label>
                                        <select onChange={(e) => setProductCategory(e.target.value)} className='form-control'>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Unisex">Unisex</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Type product description</label>
                                        <textarea onChange={(e) => setProductDescription(e.target.value)} className='form-control'></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label>Product Image</label>
                                        <input onChange={handleImageUpload} type="file" className='form-control' />
                                    </div>
                                    {previewImage && (
                                        <div className='text-center'>
                                            <img src={previewImage} alt='preview' className='img-fluid rounded mt-3' />
                                        </div>
                                    )}
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='product-list mt-4'>
                    {products.map((singleProduct) => (
                        <div className='product-item card mb-3' key={singleProduct._id}>
                            <div className='row g-0'>
                                <div className='col-md-4'>
                                    <img src={`http://localhost:5000/products/${singleProduct.productImage}`} className='img-fluid rounded-start' alt={singleProduct.productName} />
                                </div>
                                <div className='col-md-8'>
                                    <div className='card-body'>
                                        <h5 className='card-title'>{singleProduct.productName}</h5>
                                        <p className='card-text'>NPR. {singleProduct.productPrice}</p>
                                        <p className='card-text'><strong>Category:</strong> {singleProduct.productCategory}</p>
                                        <p className='card-text'>{singleProduct.productDescription}</p>
                                        <div className='d-flex justify-content-between'>
                                            {singleProduct.accepted ? (
                                                <button className='btn btn-warning'>Accepted</button>
                                            ) : (
                                                <button onClick={() => handleAcceptanceToggle(singleProduct._id)} className='btn btn-success'>Accept</button>
                                            )}
                                            <Link to={`/admin/update/${singleProduct._id}`} className='btn btn-success'>Edit</Link>
                                            <button onClick={() => handleDelete(singleProduct._id)} className='btn btn-danger'>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
