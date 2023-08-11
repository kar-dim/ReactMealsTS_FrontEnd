import IDish from '../interfaces/DishInterface';
import { useCartContext } from '../contexts/cart-context';
import { useAuth0 } from "@auth0/auth0-react";
import Settings from '../other/PublicSettings';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DishStyle from './Dish.module.css';

interface IDishProps {
    dish: IDish,
    showCurrentDishInfo(idish: IDish, fetchedDishImage: string | null) : void
};

//renders a dish (its data information is returned from the server) with an Add button
const Dish = ({dish, showCurrentDishInfo} : IDishProps) => {
    const { isAuthenticated } = useAuth0();
    const [fetchedDishImage, setFetchedDishImage] = useState<string | null>(null);
    //normally the fetch should be done by the img src=... and not in a useEffect with axios, but we need custom headers on the get image url request
    //because we are using NGROK (backend) for this app (cannot set http headers in img=src fetch)
    useEffect( () => {
        if (dish.dish_url != null) {
            const fetchDishes = async() => {
                try {
                const res = await axios.get(`${Settings.backend_url}/dishimages/${dish.dish_url}`, { responseType:"arraybuffer" });
                //convert to base64
                let b64img = btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte),''));
                setFetchedDishImage(b64img);
                } catch (error : any) {
                     // check if the error was thrown from axios
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            console.error(error.response.data);
                            console.error(error.response.status);
                            console.error(error.response.headers);
                        }
                    } else
                        console.error(error);
                }
            };
            fetchDishes();
         }
    }, []);

    const {addCartItem} = useCartContext();
    return (
        <li key = {dish.dishId}>
            <div className={DishStyle.dish_main}>
               <div className={DishStyle.dish_left} onClick={() => showCurrentDishInfo(dish, fetchedDishImage)}>
                    <div className={DishStyle.left_image}>
                        {dish.dish_url && fetchedDishImage && <img id={DishStyle.dish_left_img} src={`data:image/jpeg;charset=utf-8;base64,${fetchedDishImage}`}height={150} width={170}></img>}
                    </div>
                    <div className={DishStyle.dish_left_text}>
                        <span>{dish.dish_name}</span><br/>
                        <span style={{fontStyle : "italic"}}>{dish.dish_description}</span><br/>
                        <span className={DishStyle.dish_text_price}>$ {dish.price}</span>
                    </div>
                </div>
                <div className={DishStyle.dish_right}>
                    {isAuthenticated && <button onClick={() => {addCartItem(dish)}} className={DishStyle.add_button} type="button">+ Add</button>}
                </div>
            </div>
           <hr/>
        </li>
    );
};

export default Dish;