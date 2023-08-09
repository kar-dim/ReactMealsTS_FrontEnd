import OrderDetailsStyle from './OrderDetails.module.css';
import {useCartContext} from '../contexts/cart-context';
import { toastShow } from '../other/ToastUtils';
import axios from 'axios';
import {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Settings from '../other/PublicSettings';

interface IOrderDetails {
    closeModal() : void;
};

const OrderDetails = ({closeModal} : IOrderDetails) => {
    return (
        <div>TODO!!</div>
    )
}

export default OrderDetails;