import {IDishWithImageURLEncoded} from '../interfaces/DishInterfaces';
import style from '../styles/DishExtendedInfo.module.css'

const DishExtendedInfo = ({dish_description, dish_extended_info, dish_name, imageUrlEncoded} : IDishWithImageURLEncoded) => {
    return (
        <div id={style.main_div}>
            <div id={style.header}>
            {imageUrlEncoded !== null && <img id={style.food_pic} src={`data:image/jpeg;charset=utf-8;base64,${imageUrlEncoded}`}></img>}
                <div id={style.name_and_short_description}>
                    <h1>{dish_name}</h1>
                    <h2>{dish_description}</h2>
                </div>
            </div>
            <div id={style.description}>
                {dish_extended_info}
            </div>
        </div>
    );
};

export default DishExtendedInfo;