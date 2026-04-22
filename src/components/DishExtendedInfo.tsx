import { IDishWithImageURLEncoded } from '../interfaces/DishInterfaces';
import style from '../styles/DishExtendedInfo.module.scss'

const DishExtendedInfo = ({ dish_description, dish_extended_info, dish_name, imageUrl }: IDishWithImageURLEncoded) => {
    return (
        <div id={style.main_div}>
            <div id={style.header}>
                {imageUrl && <img id={style.food_pic} src={imageUrl}></img>}
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