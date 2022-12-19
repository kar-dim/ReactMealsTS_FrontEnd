//dish stuff + callback function gia na kanei ADD
import IDish from './DishInterface';

interface DishType {
    dish: IDish;
    addDish(dish: IDish) : void;
};

export default DishType;