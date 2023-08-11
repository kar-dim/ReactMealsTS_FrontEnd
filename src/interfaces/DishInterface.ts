//information about a Dish, data returned from the server
interface IDish {
    dishId: number,
    dish_name: string,
    dish_description: string,
    price: number,
    dish_extended_info: string,
    dish_url: string | null
};

export default IDish;