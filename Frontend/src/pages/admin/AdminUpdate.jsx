import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleProduct, updateProduct } from '../../apis/Api';
import { toast } from 'react-toastify';
import '../../CSS/AdminUpdate.css';
import axios from 'axios';

const AdminUpdate = () => {
    const { id } = useParams();

    // State variables for product information
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productNewImage, setProductNewImage] = useState(null);
    const [previewNewImage, setPreviewNewImage] = useState(null);
    const [oldImage, setOldImage] = useState('');

    // Fetch product information from backend on component mount
    useEffect(() => {
        getSingleProduct(id)
            .then((res) => {
                const productData = res.data.product;
                setProductName(productData.productName);
                setProductPrice(productData.productPrice);
                setProductDescription(productData.productDescription);
                setProductCategory(productData.productCategory);
                setOldImage(productData.productImage);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    // Handle image upload
    const handleImage = (event) => {
        const file = event.target.files[0];
        setProductNewImage(file);
        setPreviewNewImage(URL.createObjectURL(file));
    };

    // Handle product update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productCategory', productCategory);
        formData.append('productDescription', productDescription);

        if (productNewImage) {
            formData.append('productImage', productNewImage);
        }

        try {
            const res = await axios.put(`http://localhost:5000/api/product/update_product/${id}`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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

        // updateProduct(id, formData)
        //     .then((res) => {
        //         if (res.status === 201) {
        //             toast.success(res.data.message);
        //         }
        //     })
        //     .catch((error) => {
        //         if (error.response.status === 500) {
        //             toast.error(error.response.data.message);
        //         } else if (error.response.status === 400) {
        //             toast.warning(error.response.data.message);
        //         }
        //     });
    };

    return (
        <div className="update-container">
            <div className="update-card">
                <h2>Update the product, <span className='text-danger'>'{productName}'</span></h2>
                <div className="d-flex gap-3">
                    <form>
                        <label>Product Name</label>
                        <input value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" type="text" placeholder="Enter your product name" />

                        <label className="mt-2">Product Price</label>
                        <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" type="number" placeholder="Enter your product price" />

                        <label className="mt-2">Choose category</label>
                        <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="form-control">
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="unisex">Unisex</option>
                        </select>

                        <label className="mt-2">Enter description</label>
                        <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control"></textarea>

                        <label className="mt-2">Choose product Image</label>
                        <input onChange={handleImage} type="file" className="form-control" />

                        <button onClick={handleUpdate} className="btn btn-danger w-100 mt-2">Update Product</button>
                    </form>

                    <div className="image section">
                        <h6>Old Image Preview</h6>
                        <img className="img-fluid object-fit-cover rounded-4" height="200px" width="200px" src={`http://localhost:5000/products/${oldImage}`} alt="" />

                        {previewNewImage && (
                            <div>
                                <h6>New Image Preview</h6>
                                <img className="img-fluid object-fit-cover rounded-4" height="200px" width="200px" src={previewNewImage} alt="" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUpdate;
