import { IDishWithImageURLEncoded } from '../interfaces/DishInterfaces';
import { useCartContext } from '../contexts/cart-context';
import { useAuth0 } from '@auth0/auth0-react';
import { memo } from 'react';
import DishStyle from '../styles/Dish.module.scss';
import DishLoadingImage from '../media/dish_loading_skeleton.png';

interface IDishProps {
    dish: IDishWithImageURLEncoded,
    showCurrentDishInfo(dish: IDishWithImageURLEncoded): void
};

//renders a dish (its data is returned from the server) with an Add button
//the image is fetched once in MainContent and passed in via dish.imageUrl
const Dish = ({ dish, showCurrentDishInfo }: IDishProps) => {
    const { isAuthenticated } = useAuth0();
    const { addCartItem } = useCartContext();
    return (
        <li>
            <div className={DishStyle.dish_main}>
                <div className={DishStyle.dish_left} onClick={() => showCurrentDishInfo(dish)}>
                    <div className={DishStyle.left_image}>
                        {dish.dish_url && <img id={DishStyle.dish_left_img} src={dish.imageUrl ?? DishLoadingImage}></img>}
                    </div>
                    <div className={DishStyle.dish_left_text}>
                        <span id={DishStyle.dish_name}>{dish.dish_name}</span><br />
                        <span id={DishStyle.dish_description}>{dish.dish_description}</span><br />
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

export default memo(Dish);
