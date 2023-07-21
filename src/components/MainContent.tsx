import React, {useState, useEffect} from 'react';
import MainContentStyles from './MainContent.module.css';
import Dish from './Dish';
import IDish from '../interfaces/DishInterface';
import axios from 'axios';
import { toastShow } from '../other/ToastUtils';

//Main body of the website, sends the GET request and renders the dishes returned
const MainContent = () => {
    const [availableDishes, setAvailableDishes] = useState<IDish[] | null>([]);
    const [initialText, setInitialText] = useState<string>('Loading...');

    const shouldRenderList = () : boolean => {
        return (availableDishes !== null && availableDishes !== undefined && availableDishes.length > 0);
    };

    useEffect(() => {
        const getDishes = async() => {
            try {
                const response = await axios.get('http://localhost:5179/api/Dishes/GetDishes');
                const dishesRet : IDish[] | null = response.data;
                if (dishesRet != null && dishesRet.length > 0){
                    setAvailableDishes(dishesRet);
                } else {
                    setInitialText('');
                    toastShow('Could not fetch dishes', 'E');
                }
            } catch (error) {
                console.error(error);
                setInitialText('');
                toastShow('Could not fetch dishes', 'E');
            }
        };
        getDishes();
    }, []);

    return (
        shouldRenderList() ? 
        <div className={MainContentStyles.main_content}>
            <ul className={MainContentStyles.main_content_ul}>
                {availableDishes?.map(dish => {
                    return <Dish key={dish.dishId} dish={dish} />;
                })}
            </ul>
        </div> 
        : <div style={{ fontSize: '2rem', marginTop: '2rem', textAlign: 'center', color: 'white'}}>{initialText}</div>
    );
};
export default MainContent;