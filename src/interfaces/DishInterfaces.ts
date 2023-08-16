//information about a Dish, data returned from the server
export interface IDish {
    dishId: number,
    dish_name: string,
    dish_description: string,
    price: number,
    dish_extended_info: string,
    dish_url: string | null
};

export interface DishType {
    dish: IDish;
    addDish(dish: IDish) : void;
};

//used to show main page dishes
export interface IDishWithImageURLEncoded extends IDish {
    imageUrlEncoded : string | null;
};

//a newly created dish, sent from an administrator who can edit the apps dishes, it is sent to the backend API
export interface IDishToAdd {
    dish_name: string,
    dish_description: string,
    price: number,
    dish_extended_info: string,
    dish_image_base64 : string | null
};

//a dish interface used on HTTP PUT request
export interface IDishToPut extends IDishToAdd {
    dishId: number
};