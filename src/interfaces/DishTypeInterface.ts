//dish stuff + callback function to ADD
import IDish from './DishInterface';

interface DishType {
    dish: IDish;
    addDish(dish: IDish) : void;
};

export default DishType;