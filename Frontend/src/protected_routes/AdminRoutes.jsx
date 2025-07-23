import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'

const AdminRoutes = () => {
    // get user informations
    const user = JSON.parse(localStorage.getItem('user'))

    // check user and isAdmin or not
    return user != null && user.isAdmin ? <Outlet/>
        : <Navigate to={'/login'}/>
}

export default AdminRoutes
