import IDish from '../interfaces/DishInterface';
import { useCartContext } from '../contexts/cart-context';
import'./Dish.css';

interface IDishComponent {
    dish: IDish
};

//renders a dish (its data information is returned from the server) with an Add button
const Dish = ({dish} : IDishComponent) => {
    const {addCartItem} = useCartContext();
    return (
        <li>
            <div className="dish_main">
               <div className="dish_left">
                <span>{dish.dish_name}</span><br/>
                <span style={{fontStyle : "italic"}}>{dish.dish_description}</span><br/>
                <span className="dish_text_price">$ {dish.price}</span>
               </div>
               <div className="dish_right">
                  <button onClick={() => {addCartItem(dish)}} className="add_button" type="button">+ Add</button>
               </div>
            </div>
            <br/><hr/>
        </li>
    );
};

export default Dish;