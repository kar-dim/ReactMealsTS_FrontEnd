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
    const [initialText, setInitialText] = useState<string>('Loading...');
    const [currentDishExtendedInfo, setShowCurrentDishExtendedInfo] = useState<IDishWithImageURLEncoded | null>(null);
    const shouldRenderList = (): boolean => availableDishes?.length > 0;
    const fetchDishes = async () => {
        const dishes = await getDishes();
        if (!dishes.length) {
            setInitialText('');
            toastShow('Could not fetch dishes', 'E');
            return;
        }
        setAvailableDishes(dishes);
    };

    //fetch all dishes at startup
    useEffect(() => {
        fetchDishes();
    }, []);

    return (
        shouldRenderList() ?
            <>
                {currentDishExtendedInfo !== null && <Modal showModal={currentDishExtendedInfo !== null} closeModal={() => setShowCurrentDishExtendedInfo(null)}>
                    <div>
                        {<DishExtendedInfo {...currentDishExtendedInfo} ></DishExtendedInfo>}
                    </div>
                </Modal>
                }
                <div className={MainContentStyles.main_content}>
                    <ul className={MainContentStyles.main_content_ul}>
                        {availableDishes?.map(dish => (
                            <Dish key={dish.dishId} dish={dish} showCurrentDishInfo={(dish, fetchedDishImage) =>
                                setShowCurrentDishExtendedInfo({ ...dish, imageUrlEncoded: fetchedDishImage })}
                            />
                        ))}
                    </ul>
                </div>
            </>
            : initialText == '' ?
                <div className={`${MainContentStyles.main_content} ${MainContentStyles.main_content_error}`}>
                    <h1 id={MainContentStyles.main_content_error_h1}>Internal Error. Please try again later.</h1>
                    <img id={MainContentStyles.error_img} src={ErrorImage}></img>
                </div>
                : <div style={{ fontSize: '2rem', marginTop: '2rem', textAlign: 'center', color: 'white' }}>{initialText}</div>

    );
};
export default MainContent;