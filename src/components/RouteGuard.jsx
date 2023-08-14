import React from 'react';
import { Navigate } from 'react-router-dom';
import {validateJWT} from '../helpers'
 
const RouteGuard = ({ children, redirectTo }) => {
   return validateJWT() ? children:<Navigate to={redirectTo} />
};
 
export default RouteGuard;