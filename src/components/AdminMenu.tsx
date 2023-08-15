import adminStyle from "./AdminMenu.module.css"
import Header from "./Header";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toastShow } from "../other/ToastUtils";
import { useRef, useState } from "react";
import { IDishToAdd } from "../interfaces/DishInterfaces";
import { useAuth0 } from "@auth0/auth0-react";
import { ApiRoutes, Settings } from "../other/PublicSettings";

const AdminMenu = () => {
    
    const {getAccessTokenSilently} = useAuth0();
    const [addDishImageBase64, setAddDishImageBase64] = useState<string | null>(null);
    const addDishButton = useRef<HTMLButtonElement>(null);

    //when the user clicks ADD DISH
    const addDish = async(event : any) => {
        event.preventDefault();
        if (addDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        const dishToSend :IDishToAdd = {
            dish_name : event.target.elements.dish_name.value,
            price : event.target.elements.dish_price.value,
            dish_description : event.target.elements.dish_description.value,
            dish_extended_info : event.target.elements.dish_extended_description.value,
            dish_image_base64 : addDishImageBase64
        };

        //send http POST request
        try {
            if (addDishButton.current)
                addDishButton.current.setAttribute("disabled", "true");
            //get auth0 access token
            const accessToken = await getAccessTokenSilently();
            await axios.post(`${Settings.backend_url}/${ApiRoutes.AddDish}`, dishToSend , {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            toastShow('The Dish was successfully added to the database', 'S');
        } catch (error : any) {
            toastShow('Error in adding the dish. Check console log', 'E');
             // check if the error was thrown from axios
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                }
            } else
                console.error(error);
        } finally {
            if (addDishButton.current)
                addDishButton.current.removeAttribute("disabled");
        }
    }

    //check the size of the uploaded file (mut be 3MB MAX)
    const addDishImageHandler = (event : any) => {
        let file = event.target.files[0];
        if (file.size > 3000000){
            toastShow("File size is too big", "E");
            setAddDishImageBase64(null);
            return;
        }
        
        var reader = new FileReader();
         reader.onload = function() {
            if (!this.result) {
                toastShow("Could not upload the file", "E");
                setAddDishImageBase64(null);
                return;
            }
            let fileStr = (this.result as string);
            let comma : number = fileStr.indexOf(',');
            if (comma == -1){
                toastShow("Could not upload the file", "E");
                setAddDishImageBase64(null);
                return;
            }
            var base64str = fileStr.substring(comma + 1);
            setAddDishImageBase64(base64str);
        }
        reader.readAsDataURL(file);
    };

    return (
        <>
        <Header />
        <div id={adminStyle.main}>
            <div id={adminStyle.main_content}>
            <Tabs>
                <TabList>
                <Tab>Add Dish</Tab>
                <Tab>Edit Dishes</Tab>
                <Tab>Edit Users</Tab>
                </TabList>

                <TabPanel>
                    <div id={adminStyle.main_adddish}>
                        <div>
                            <form id={adminStyle.add_dish_form} onSubmit={(event) => addDish(event)}>
                                <div id={adminStyle.add_dish_1}>
                                    <div id={adminStyle.add_dish_1_name}>
                                        <label id={adminStyle.adminmenu_dish_name_label} htmlFor={adminStyle.adminmenu_dish_name}>Dish name:</label>
                                        <input required type="text" id={adminStyle.adminmenu_dish_name} name="dish_name" maxLength={50}></input>
                                    </div>
                                    <div id={adminStyle.add_dish_1_description}>
                                        <label id={adminStyle.adminmenu_dish_description_label} htmlFor={adminStyle.adminmenu_dish_description}>Dish Description:</label>
                                        <input required type="text" id={adminStyle.adminmenu_dish_description} name="dish_description" maxLength={70}></input>
                                    </div>
                                    <div id={adminStyle.add_dish_1_price}>
                                        <label id={adminStyle.adminmenu_dish_price_label} htmlFor={adminStyle.adminmenu_dish_price}>Dish Price:</label>
                                        <input required type="number" id={adminStyle.adminmenu_dish_price} placeholder="0.00" name="dish_price" min="0" defaultValue="0.01" step="0.01" pattern="^\d+\.\d{2}$"></input>
                                    </div>
                                </div>

                                <div id={adminStyle.add_dish_2}>
                                    <label id={adminStyle.adminmenu_dish_extended_description_label} htmlFor={adminStyle.adminmenu_dish_extended_description}>Dish extended info:</label>
                                    <textarea minLength={1} rows={10} cols={120} id={adminStyle.adminmenu_dish_extended_description} name="dish_extended_description" maxLength={1800}></textarea>
                                </div>

                                <div id={adminStyle.add_dish_3}>
                                    <label id={adminStyle.adminmenu_imageFile_label}htmlFor={adminStyle.adminmenu_imageFile}>Dish Image:</label>
                                    <input type="file" required id={adminStyle.adminmenu_imageFile} name="imageFile" onChange={addDishImageHandler} accept="image/*"></input>
                                </div>
                                <div id={adminStyle.add_dish_4}>
                                    <button type="submit" ref={addDishButton} className={adminStyle.custom_button}>Add Dish</button>
                                </div>
                            </form> 
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div id={adminStyle.main_editdishes}>

                    </div>
                </TabPanel>
                <TabPanel>
                    <div id={adminStyle.main_editusers}>

                    </div>
                </TabPanel>
            </Tabs>
            </div>
        </div>
    </>
    );
}

export default AdminMenu;