import React from 'react';
import DishType from '../interfaces/DishTypeInterface';
import ICartItem from '../interfaces/CartItemInterface';
import'./Dish.css';

const Dish = ({dish, addDish} : DishType) => {
    const addDishHandler = () => {
        addDish(dish);
        var localStorageItems = localStorage.getItem('cartItems');
        let arr : ICartItem[] = [];
        //not empty, append dish to existing items
        if (localStorageItems !== null)
            arr = JSON.parse(localStorageItems);
        arr.push(dish);
        localStorage.setItem('cartItems', JSON.stringify(arr));
    };

    return (
        <li>
            <div className="dish_main">
               <div className="dish_left">
                <span>{dish.dish_name}</span><br/>
                <span style={{fontStyle : "italic"}}>{dish.dish_description}</span><br/>
                <span className="dish_text_price">$ {dish.price}</span>
               </div>
               <div className="dish_right">
                  <button onClick={addDishHandler} className="add_button" type="button">+ Add</button>
               </div>
            </div>
            <br/><hr/>
        </li>
    );
};

export default Dish;