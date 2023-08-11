import IDish from "./DishInterface";

export default interface IDishWithImageURLEncoded extends IDish {
    imageUrlEncoded : string | null;
}