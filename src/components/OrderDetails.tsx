import OrderDetailsStyle from './OrderDetails.module.css';
import { toastShow } from '../other/ToastUtils';
import axios from 'axios';
import {useEffect, useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Settings from '../other/PublicSettings';
import IDish from '../interfaces/DishInterface';
import NoOrdersPic from '../media/sad_food.jpg';
import { Tooltip } from 'react-tooltip';
import React from 'react';

//props
interface IOrderDetailsProps {
    closeModal() : void;
};

interface IDishWithCounter extends IDish {
    dish_counter : number
}
interface IOrder {
    id: number
    dishes: Array<IDishWithCounter>,
    totalCost: number,
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
            closeModal();
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
        return null;
    }
    //fetched, but 0 orders
    if (userOrders.orders.length == 0) {
        return (
        <div id={OrderDetailsStyle.no_orders}>
            <h1>You have no orders yet.</h1>
            <img loading='lazy' src={NoOrdersPic}></img>
            
        </div>
        )
    }

    //fetched orders
    return (
        <div id={OrderDetailsStyle.main_div}>
            <ul className={OrderDetailsStyle.order_details_ul}>
                {
                  userOrders.orders.map((order : IOrder, index : number) => {
                    return (
                        <React.Fragment key={index}>
                        <li>
                            <div className={OrderDetailsStyle.order_container_details}>
                                <h2 id={OrderDetailsStyle.order_id}>Order ID #{order.id}</h2>
                                <div className={OrderDetailsStyle.order_details}>
                                    <div className={OrderDetailsStyle.order_food_details}>
                                        {
                                            order.dishes.map((dish : IDishWithCounter, food_index : number) => {
                                                return (
                                                    <React.Fragment key = {"" + index + food_index}>
                                                        <div id={OrderDetailsStyle.order_food_detail}>
                                                            <span data-tooltip-id={"food-name-tooltip"+ index + food_index} data-tooltip-content={dish.dish_description}>{dish.dish_name}</span>
                                                            <Tooltip id={"food-name-tooltip" + index + food_index} />
                                                            <div id={OrderDetailsStyle.order_food_detail_right_part}>
                                                                <span style={{marginRight: "10px", fontWeight: "600"}}>{dish.price}$</span>
                                                                <div className={OrderDetailsStyle.food_counter_box}>
                                                                    <span>x {dish.dish_counter}</span>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        <br></br>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={OrderDetailsStyle.order_food_details_total}>
                                        <span id={OrderDetailsStyle.order_food_details_total_span}>Total: {order.totalCost}$</span>
                                    </div>
                                </div>
                            </div>    
                        </li>
                        <hr></hr>
                        </React.Fragment>
                    );
                  })
                }
            </ul>
        </div>
    )
}

export default OrderDetails;