import { useState, useEffect } from 'react';
import MainContentStyles from '../styles/MainContent.module.scss';
import Dish from './Dish';
import { IDish, IDishWithImageURLEncoded } from '../interfaces/DishInterfaces';
import { toastShow } from '../other/ToastUtils';
import Modal from './Modal';
import DishExtendedInfo from './DishExtendedInfo';
import ErrorImage from '../media/sad_food.jpg';
import { getDishes } from '../other/utils';

//Main body of the website, sends the GET request and renders the dishes returned
const MainContent = () => {
    const [availableDishes, setAvailableDishes] = useState<IDish[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [currentDishExtendedInfo, setShowCurrentDishExtendedInfo] = useState<IDishWithImageURLEncoded | null>(null);

    const fetchDishes = async () => {
        const dishes = await getDishes();
        if (!dishes.length) {
            setHasError(true);
            toastShow('Could not fetch dishes', 'E');
        } else {
            setAvailableDishes(dishes);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDishes();
    }, []);

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
                        <Dish key={dish.dishId} dish={dish} showCurrentDishInfo={(dish, fetchedDishImage) =>
                            setShowCurrentDishExtendedInfo({ ...dish, imageUrl: fetchedDishImage })}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
};
export default MainContent;