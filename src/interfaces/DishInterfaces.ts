//information about a Dish, data returned from the server
export interface IDish {
    dishId: number,
    dish_name: string,
    dish_description: string,
    price: number,
    dish_extended_info: string,
    dish_url: string | null
};

export interface IDishWithCounter extends IDish {
    dish_counter : number
}

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

//helper converter functions
export const createDishToPut = (dish: IDish, imageBase64: string | null): IDishToPut => ({
    dishId: dish.dishId,
    price: dish.price,
    dish_name: dish.dish_name,
    dish_description: dish.dish_description,
    dish_extended_info: dish.dish_extended_info,
    dish_image_base64: imageBase64
});

export const createDishToAddFromForm = (form: HTMLFormElement, imageBase64: string | null): IDishToAdd => ({
    dish_name: (form.elements.namedItem('dish_name') as HTMLInputElement).value,
    price: parseFloat((form.elements.namedItem('dish_price') as HTMLInputElement).value),
    dish_description: (form.elements.namedItem('dish_description') as HTMLInputElement).value,
    dish_extended_info: (form.elements.namedItem('dish_extended_description') as HTMLInputElement).value,
    dish_image_base64: imageBase64
});

export const createDishToPutFromForm = (form: HTMLFormElement, imageBase64: string | null, dishId: number): IDishToPut => ({
        dishId: dishId,
        dish_name: (form.elements.namedItem('dish_name') as HTMLInputElement).value,
        price: parseFloat((form.elements.namedItem('dish_price') as HTMLInputElement).value),
        dish_description: (form.elements.namedItem('dish_description') as HTMLInputElement).value,
        dish_extended_info: (form.elements.namedItem('dish_extended_description') as HTMLInputElement).value,
        dish_image_base64 : imageBase64
});

export const createDishToPutFromAdd = (dishToSend: IDishToAdd, id: number) : IDishToPut => ({
    dishId: id,
    price: dishToSend.price,
    dish_name: dishToSend.dish_name,
    dish_description: dishToSend.dish_description,
    dish_extended_info: dishToSend.dish_extended_info,
    dish_image_base64: dishToSend.dish_image_base64
});