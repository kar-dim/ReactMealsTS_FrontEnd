import { IDish } from '../interfaces/DishInterfaces';
import { useCartContext } from '../contexts/cart-context';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import DishStyle from '../styles/Dish.module.scss';
import DishLoadingImage from '../media/dish_loading_skeleton.png';
import { getDishImage } from '../other/utils';

interface IDishProps {
    dish: IDish,
    showCurrentDishInfo(idish: IDish, fetchedDishImage: string | null): void
};

//renders a dish (its data information is returned from the server) with an Add button
const Dish = ({ dish, showCurrentDishInfo }: IDishProps) => {
    const { isAuthenticated } = useAuth0();
    const [fetchedDishImage, setFetchedDishImage] = useState<string | null>(null);
    const fetchDishImage = async () => {
        const b64img = await getDishImage(dish.dish_url!);
        if (b64img !== "")
            setFetchedDishImage(b64img);
    };
    //normally the fetch should be done by the img src=... and not in a useEffect with axios, but we need custom headers on the get image url request
    //because we are using NGROK (backend) for this app (cannot set http headers in img=src fetch)
    useEffect(() => {
        if (dish.dish_url == null)
            return;
        fetchDishImage();
    }, []);

    const { addCartItem } = useCartContext();
    return (
        <li key={dish.dishId}>
            <div className={DishStyle.dish_main}>
                <div className={DishStyle.dish_left} onClick={() => showCurrentDishInfo(dish, fetchedDishImage)}>
                    <div className={DishStyle.left_image}>
                        {dish.dish_url && fetchedDishImage && <img id={DishStyle.dish_left_img} src={`data:image/*;charset=utf-8;base64,${fetchedDishImage}`}></img>}
                        {dish.dish_url && !fetchedDishImage && <img id={DishStyle.dish_left_img} src={DishLoadingImage}></img>}
                    </div>
                    <div className={DishStyle.dish_left_text}>
                        <span id={DishStyle.dish_name}>{dish.dish_name}</span><br />
                        <span id={DishStyle.dish_description} style={{ fontStyle: "italic" }}>{dish.dish_description}</span><br />
                        <span id={DishStyle.dish_text_price}>$ {dish.price.toFixed(2)}</span>
                    </div>
                </div>
                <div className={DishStyle.dish_right}>
                    {isAuthenticated && <button onClick={() => { addCartItem(dish) }} className={DishStyle.add_button} type="button">+ Add</button>}
                </div>
            </div>
            <hr />
        </li>
    );
};

export default Dish;