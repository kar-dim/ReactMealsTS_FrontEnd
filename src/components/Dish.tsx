import React from 'react';
import DishType from '../interfaces/DishTypeInterface';
import'./Dish.css';

const Dish = ({dish, addDish} : DishType) => {
    return (
        <li>
            <div className="dish_main">
               <div className="dish_left">
                <span>{dish.dish_name}</span><br/>
                <span style={{fontStyle : "italic"}}>{dish.dish_description}</span><br/>
                <span className="dish_text_price">$ {dish.price}</span>
               </div>
               <div className="dish_right">
                  <button onClick={() => {addDish(dish)}} className="add_button" type="button">+ Add</button>
               </div>
            </div>
            <br/><hr/>
        </li>
    );
};

export default Dish;