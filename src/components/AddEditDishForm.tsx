import { FormEvent } from "react";
import adminStyle from "./AdminMenu.module.css"

interface IAddEditDishFormProps {
    preFilledValues? : {
        dish_name: string,
        dish_description: string,
        price: number,
        dish_extended_description: string
    } | null,
    addOrEditDish(event: FormEvent<HTMLFormElement>) : void,
    addOrEditDishImageHandler(event: any, isAdd: boolean) : void,
    addOrEditDishButton: any,
    isUsedForAdd: boolean //is true -> ADD DISH form, else -> EDIT DISH form
}

const AddEditDishForm = ({preFilledValues, addOrEditDish,addOrEditDishImageHandler, addOrEditDishButton, isUsedForAdd} : IAddEditDishFormProps) => {
    return (
        <div>
            <div>
                <form id={adminStyle.add_dish_form} onSubmit={(event) => addOrEditDish(event)}>
                    <div id={adminStyle.add_dish_1}>
                        <div id={adminStyle.add_dish_1_name}>
                            <label id={adminStyle.adminmenu_dish_name_label} htmlFor={adminStyle.adminmenu_dish_name}>Dish name:</label>
                            <input required type="text" id={adminStyle.adminmenu_dish_name} defaultValue={preFilledValues == null ? "" : preFilledValues.dish_name} name="dish_name" maxLength={50}></input>
                        </div>
                        <div id={adminStyle.add_dish_1_description}>
                            <label id={adminStyle.adminmenu_dish_description_label} htmlFor={adminStyle.adminmenu_dish_description}>Dish Description:</label>
                            <input required type="text" id={adminStyle.adminmenu_dish_description} defaultValue={preFilledValues == null ? "" : preFilledValues.dish_description} name="dish_description" maxLength={70}></input>
                        </div>
                        <div id={adminStyle.add_dish_1_price}>
                            <label id={adminStyle.adminmenu_dish_price_label} htmlFor={adminStyle.adminmenu_dish_price}>Dish Price:</label>
                            <input required type="number" id={adminStyle.adminmenu_dish_price} defaultValue={preFilledValues == null ? 0.01 : preFilledValues.price} placeholder="0.00" name="dish_price" min="0" step="0.01" pattern="^\d+\.\d{2}$"></input>
                        </div>
                    </div>

                    <div id={adminStyle.add_dish_2}>
                        <label id={adminStyle.adminmenu_dish_extended_description_label} htmlFor={adminStyle.adminmenu_dish_extended_description}>Dish extended info:</label>
                        <textarea minLength={1} rows={10} cols={120} id={adminStyle.adminmenu_dish_extended_description} defaultValue={preFilledValues == null ? "" : preFilledValues.dish_extended_description}  name="dish_extended_description" maxLength={1800}></textarea>
                    </div>

                    <div id={adminStyle.add_dish_3}>
                        <label id={adminStyle.adminmenu_imageFile_label}htmlFor={adminStyle.adminmenu_imageFile}>Dish Image:</label>
                        <input type="file" required id={adminStyle.adminmenu_imageFile} name="imageFile" onChange={(e) => addOrEditDishImageHandler(e, isUsedForAdd)} accept="image/*"></input>
                    </div>
                    <div id={adminStyle.add_dish_4}>
                        <button type="submit" ref={addOrEditDishButton} className={adminStyle.custom_button}>{isUsedForAdd ? "Add Dish" : "Edit Dish"}</button>
                    </div>
                </form> 
            </div>
        </div>
    );
}

export default AddEditDishForm;