import OrderDetailsStyle from './OrderDetails.module.css';
import {useCartContext} from '../contexts/cart-context';
import { toastShow } from '../other/ToastUtils';
import axios from 'axios';
import {useEffect, useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Settings from '../other/PublicSettings';
import IDish from '../interfaces/DishInterface';

//props
interface IOrderDetailsProps {
    closeModal() : void;
};

interface IDishWithCounter extends IDish {
    dish_counter : number
}
interface IOrder {
    dishes: Array<IDishWithCounter>,
    totalCost: number
}
//array of orders
interface IOrders {
    orders: Array<IOrder>
}

const OrderDetails = ({closeModal} : IOrderDetailsProps) => {

    const { user, getAccessTokenSilently } = useAuth0();
    const [isFetchingOrders, setIsFetchingOrders] = useState<boolean>(true); //axios GET request fetching
    const [userOrders, setUserOrders] = useState<IOrders | null>(null);
    const getOrders = async () => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                  audience: Settings.auth0_audience
                }});

            //should never happen
            if (user == undefined || user.sub == undefined){
                toastShow("Could not send the request. Please try again later", "E");
                return; //will go to finally block
            }
            let headers : any = {
                Authorization: `Bearer ${accessToken}`
            };
            //if backend is using ngrok -> add extra http header
            if (Settings.backend_ngrok == true)
                headers['ngrok-skip-browser-warning'] = true;

            //send the get request
            const response = await axios.get(
                `${Settings.backend_url}/api/Dishes/GetUserOrders/${user?.sub}`,{
                    headers : headers
                });

            //check response
            const ordersRet : IOrders | null = response.data;
            setUserOrders(ordersRet);
        } catch (error) {
            console.error(error);
            setUserOrders(null);
            toastShow('Could not fetch Orders', 'E');
        } finally {
            setIsFetchingOrders(false);
            return;
        }
    }

    //call once
    useEffect( () => {
        //get request
        if (userOrders == null)
            getOrders();
    },[]);

    if (isFetchingOrders)
        return <div>Loading...</div>

    //could not fetch data (request/response error probably)
    if (userOrders == null || userOrders.orders == null) {
        closeModal();
        return null;
    }
    //fetched, but 0 orders
    if (userOrders.orders.length == 0) {
        return <div>YOU have 0 orders RE FTWXE AGORASE KATI :P</div>
    }

    //fetched orders
    return (
        <div>TODO, YOUR ORDERS HERE!!</div>
    )
}

export default OrderDetails;