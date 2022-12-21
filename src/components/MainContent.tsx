import React, {useState} from 'react';
import MainContentStyles from './MainContent.module.css';
import Dish from './Dish';
import IDish from '../interfaces/DishInterface';

const dishes : IDish[] = [
    {
        id: 1,
        dish_name: "Sushi",
        dish_description: "Best sushi from japan!",
        price: 8.37
    },
    {
        id: 2,
        dish_name: "Cheeseburger",
        dish_description: "Hottest cheese and with the softest of buns!",
        price: 2.30
    },
    {
        id: 3,
        dish_name: "Schnitzel",
        dish_description: "So crispy! Yummmmmm",
        price: 7.85
    },
    {
        id: 4,
        dish_name: "Greek Dolmadakia",
        dish_description: "Traditional greek dish!",
        price: 7.20
    },
    {
        id: 5,
        dish_name: "Pastitsio",
        dish_description: "Traditional greek dish with Besamel",
        price: 8.40
    }
];

const MainContent = () => {
    //TODO: arxika ta diavazei fixed times, opote to state einai USELESS, otan  ta diavazei apo DB (an graftei to API )
    //tote tha exei aksia (px arxikopoihsh me EMPTY kai otan ta diavasei pisw na kanei populate to state, pithanon na exei kai alla states (px ERROR, LOADING))
    const [availableDishes, setAvailableDishes] = useState<IDish[] | null>(dishes);
    const shouldRenderList = () : boolean => {
        return (availableDishes !== null && availableDishes !== undefined && availableDishes.length > 0);
    };

    return (
        shouldRenderList() ? 
        <div className={MainContentStyles.main_content}>
            <ul className={MainContentStyles.main_content_ul}>
                {availableDishes?.map(dish => {
                    return <Dish key={dish.id} dish={dish} />;
                })}
            </ul>
        </div> 
        : <div></div>
    );
};
export default MainContent;