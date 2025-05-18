import OrderDetailsStyle from '../styles/OrderDetails.module.css';
import { toastShow } from '../other/ToastUtils';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoutes } from '../other/PublicSettings';
import { IDishWithCounter } from '../interfaces/DishInterfaces';
import NoOrdersPic from '../media/sad_food.jpg';
import { Tooltip } from 'react-tooltip';
import React from 'react';
import { get } from '../other/utils';

interface IOrderDetailsProps {
    closeModal(): void;
};

interface IOrder {
    id: number
    dishes: Array<IDishWithCounter>,
    totalCost: number,
}

interface IOrders {
    orders: Array<IOrder>
}

const OrderDetails = ({ closeModal }: IOrderDetailsProps) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isFetchingOrders, setIsFetchingOrders] = useState<boolean>(true); //axios GET request fetching
    const [userOrders, setUserOrders] = useState<IOrders | null>(null);
    const getOrders = async () => {
        try {
            const ordersRet = await get<IOrders | null>(`${ApiRoutes.GetUserOrders}/${user?.sub}`, await getAccessTokenSilently());
            setUserOrders(ordersRet);
        } catch (error) {
            console.error(error);
            setUserOrders(null);
            toastShow('Could not fetch Orders', 'E');
            closeModal();
        } finally {
            setIsFetchingOrders(false);
        }
    }

    //call once
    useEffect(() => {
        if (userOrders == null)
            getOrders();
    }, []);

    if (isFetchingOrders)
        return <div>Loading...</div>

    //fetched, but 0 orders
    if (userOrders == null || userOrders.orders.length == 0) {
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
                    userOrders.orders.map((order: IOrder, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <li>
                                    <div className={OrderDetailsStyle.order_container_details}>
                                        <h2 id={OrderDetailsStyle.order_id}>Order ID #{order.id}</h2>
                                        <div className={OrderDetailsStyle.order_details}>
                                            <div className={OrderDetailsStyle.order_food_details}>
                                                {
                                                    order.dishes.map((dish: IDishWithCounter, food_index: number) => {
                                                        return (
                                                            <React.Fragment key={"" + index + food_index}>
                                                                <div id={OrderDetailsStyle.order_food_detail}>
                                                                    <span data-tooltip-id={"food-name-tooltip" + index + food_index} data-tooltip-content={dish.dish_description}>{dish.dish_name}</span>
                                                                    <Tooltip id={"food-name-tooltip" + index + food_index} />
                                                                    <div id={OrderDetailsStyle.order_food_detail_right_part}>
                                                                        <span style={{ marginRight: "10px", fontWeight: "600" }}>$ {dish.price.toFixed(2)}</span>
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
                                                <span id={OrderDetailsStyle.order_food_details_total_span}>Total: $ {order.totalCost}</span>
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
    );
}

export default OrderDetails;