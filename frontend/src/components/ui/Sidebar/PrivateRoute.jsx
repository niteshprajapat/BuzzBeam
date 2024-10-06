import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


const PrivateRoute = () => {

    const { token } = useSelector((store) => store.auth);


    return token ? <Outlet /> : <Navigate to={"/login"} />
}

export default PrivateRoute