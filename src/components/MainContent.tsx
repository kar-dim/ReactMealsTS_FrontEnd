import { useState, useEffect, useCallback } from 'react';
import MainContentStyles from '../styles/MainContent.module.scss';
import Dish from './Dish';
import { IDishWithImageURLEncoded } from '../interfaces/DishInterfaces';
import { toastShow } from '../other/ToastUtils';
import Modal from './Modal';
import DishExtendedInfo from './DishExtendedInfo';
import ErrorImage from '../media/sad_food.jpg';
import { getDishes, getDishImageUrl } from '../other/utils';

//Main body of the website, sends the GET request and renders the dishes returned
const MainContent = () => {
    const [availableDishes, setAvailableDishes] = useState<IDishWithImageURLEncoded[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [currentDishExtendedInfo, setShowCurrentDishExtendedInfo] = useState<IDishWithImageURLEncoded | null>(null);

    const fetchDishes = async () => {
        const dishes = await getDishes();
        if (!dishes.length) {
            setHasError(true);
            toastShow('Could not fetch dishes', 'E');
            setIsLoading(false);
            return;
        }
        // render the text immediately, then fill in images once they arrive
        setAvailableDishes(dishes.map(dish => ({ ...dish, imageUrl: null })));
        setIsLoading(false);
        const imageUrls = await Promise.all(
            dishes.map(dish => dish.dish_url ? getDishImageUrl(dish.dish_url) : Promise.resolve(null))
        );
        setAvailableDishes(dishes.map((dish, i) => ({ ...dish, imageUrl: imageUrls[i] || null })));
    };

    useEffect(() => {
        fetchDishes();
    }, []);

    const showDishInfo = useCallback((dish: IDishWithImageURLEncoded) => setShowCurrentDishExtendedInfo(dish), []);

    if (isLoading)
        return <div id={MainContentStyles.main_content_initial}>Loading...</div>;

    if (hasError)
        return (
            <div className={`${MainContentStyles.main_content} ${MainContentStyles.main_content_error}`}>
                <h1 id={MainContentStyles.main_content_error_h1}>Internal Error. Please try again later.</h1>
                <img id={MainContentStyles.error_img} src={ErrorImage}></img>
            </div>
        );

    return (
        <>
            {currentDishExtendedInfo && <Modal showModal={true} closeModal={() => setShowCurrentDishExtendedInfo(null)}>
                <div>
                    <DishExtendedInfo {...currentDishExtendedInfo} />
                </div>
            </Modal>}
            <div className={MainContentStyles.main_content}>
                <ul className={MainContentStyles.main_content_ul}>
                    {availableDishes.map(dish => (
                        <Dish key={dish.dishId} dish={dish} showCurrentDishInfo={showDishInfo} />
                    ))}
                </ul>
            </div>
        </>
    );
};
export default MainContent;