import React, { useState } from 'react';
import '../../CSS/Sidebar.css'; //adding css
import { Link } from 'react-router-dom';
import add_product_icon from '../../Assets/Product_Cart.svg';
import list_product_icon from '../../Assets/Product_list_icon.svg';
import Footer from '../../components/Footer';

const Sidebar = () => {

  return (
    <div className='sidebar'>
      <Link to={'/admin/dashboard'} style={{ textDecoration: "none" }}>
        <div className='sidebar-item'>
          <img src={add_product_icon} alt="Add Product Icon" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/admin/update/:id'} style={{ textDecoration: "none" }}>
        <div className='sidebar-item'>
          <img src={list_product_icon} alt="List Product Icon" />
          <p>Update Product</p>
        </div>
      </Link>
    </div>
    
  );
}

export default Sidebar;
