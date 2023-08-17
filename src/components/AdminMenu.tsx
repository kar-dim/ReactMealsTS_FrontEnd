import adminStyle from "./AdminMenu.module.css"
import Header from "./Header";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toastShow } from "../other/ToastUtils";
import { useEffect, useRef, useState } from "react";
import { IDish, IDishToAdd, IDishToPut } from "../interfaces/DishInterfaces";
import { useAuth0 } from "@auth0/auth0-react";
import { ApiRoutes, OtherRoutes, Settings } from "../other/PublicSettings";
import NoDishesPic from '../media/sad_food.jpg';
import IconEdit from '../media/icon_edit.png';
import IconDelete from '../media/icon_delete.png';
import Modal from "./Modal";
import AddEditDishForm from "./AddEditDishForm";

const AdminMenu = () => {
    
    const [availableDishes, setAvailableDishes] = useState<IDishToPut[]>([]);
    const {getAccessTokenSilently} = useAuth0();
    const [addDishImageBase64, setAddDishImageBase64] = useState<string | null>(null);
    const [editDishImageBase64, setEditDishImageBase64] = useState<string | null>(null);
    const [dishToEdit, setDishToEdit] = useState<IDishToPut | null>(null);
    //add dish, edit modal
    const addDishButton = useRef<HTMLButtonElement | null>(null);
    const editDishButton = useRef<HTMLButtonElement | null>(null);
    //edit dishes edit/delete buttons
    const editDishButtons = useRef<(HTMLButtonElement | null)[]>([]);
    const deleteDishButtons = useRef<(HTMLButtonElement | null)[]>([]);
    
    //get all the available dishes on startup
    useEffect(() => {
        //this should run ONLY once to fetch all the dishes from db at first, if somehow it runs again, don't do anything
        if (availableDishes.length == 0) {
            const getDishes = async() => {
                try {
                    const response = await axios.get(`${Settings.backend_url}/${ApiRoutes.GetDishes}`);
                    const dishesRet : IDish[] | null = response.data;
                    if (dishesRet != null && dishesRet.length > 0) {
                        let dishes :IDishToPut[] = [];
                        //foreach one, get the image
                        await Promise.all(dishesRet.map(async(dish) => {
                            let responseImage;
                            let b64img;
                            try {
                               responseImage = await axios.get(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dish.dish_url}`, { responseType:"arraybuffer" });
                               //convert to base64
                                b64img = btoa(new Uint8Array(responseImage.data).reduce((data, byte) => data + String.fromCharCode(byte),''));
                            } catch (error) {
                                //image not found? it's OK, don't throw errors or exit, just don't show the image
                                b64img = "";
                            }
                            
                            dishes.push({
                                dishId: dish.dishId,
                                price: dish.price,
                                dish_name: dish.dish_name,
                                dish_description: dish.dish_description,
                                dish_extended_info: dish.dish_extended_info,
                                dish_image_base64: b64img,
                            });
                        }));
                        setAvailableDishes([...availableDishes, ...dishes ]);
                        
                    } else {
                        toastShow('Could not fetch dishes', 'E');
                    }
                } catch (error) {
                    console.error(error);
                    toastShow('Could not fetch dishes', 'E');
                }
            };
            getDishes();
        }   
    }, []);
    
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
            //send the post request
            const response = await axios.post(`${Settings.backend_url}/${ApiRoutes.AddDish}`, dishToSend , {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            toastShow('The Dish was successfully added to the database, with ID: ' + response.data, 'S');
            //append to the local dishes
            let newlyCreatedDish : IDishToPut = {
                dishId: response.data,
                price: dishToSend.price,
                dish_name: dishToSend.dish_name,
                dish_description: dishToSend.dish_description,
                dish_extended_info: dishToSend.dish_extended_info,
                dish_image_base64: dishToSend.dish_image_base64
            }
            setAvailableDishes((prev) => ([...prev, newlyCreatedDish]));

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
    };

    const editDish = async(event: any) => {
        event.preventDefault();
        if (editDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        //disable edit dish button while the operation is in progress
        editDishButton.current!.setAttribute("disabled", "true");

        const dishToSend :IDishToPut = {
            dishId: dishToEdit!.dishId,
            dish_name : event.target.elements.dish_name.value,
            price : event.target.elements.dish_price.value,
            dish_description : event.target.elements.dish_description.value,
            dish_extended_info : event.target.elements.dish_extended_description.value,
            dish_image_base64 : editDishImageBase64
        };

        //send http PUT request
        try {
            //get auth0 access token
            const accessToken = await getAccessTokenSilently();
            //send the put request
            await axios.put(`${Settings.backend_url}/${ApiRoutes.UpdateDish}`, dishToSend , {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            toastShow('Dish update success', 'S');
            //update this specific dish locally, and then re-render
            const availableDishesC = availableDishes.map(x => x);
            for (let i=0; i<availableDishesC.length; i++) {
                if (availableDishesC[i].dishId == dishToSend.dishId) {
                    availableDishesC[i] = {
                        dishId: availableDishesC[i].dishId,
                        dish_name: dishToSend.dish_name,
                        dish_description: dishToSend.dish_description,
                        dish_extended_info: dishToSend.dish_extended_info,
                        price: dishToSend.price,
                        dish_image_base64: dishToSend.dish_image_base64
                    }
                }
            }
            setAvailableDishes(availableDishesC);
            setDishToEdit(null);
        } catch (error : any) {
            toastShow('Error in updating the dish. Check console log', 'E');
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
            //enable the button again
            editDishButton.current!.removeAttribute("disabled");
        }
    };

    
    const deleteDish = async(dishIdToDelete: number) => {
        //disable all buttons while the Delete operation is in progress
        for (let i = 0; i < availableDishes.length; i++) {
            editDishButtons.current[i]?.setAttribute("disabled", "true");
            deleteDishButtons.current[i]?.setAttribute("disabled", "true");
        } 

         //send http DELETE request
        try {
            //get auth0 access token
            const accessToken = await getAccessTokenSilently();
            //send the delete request
            await axios.delete(`${Settings.backend_url}/${ApiRoutes.DeleteDish}/${dishIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            toastShow('Dish delete success', 'S');
            setAvailableDishes(prev => prev.filter((dish) => dish.dishId != dishIdToDelete));
        } catch (error : any) {
             // check if the error was thrown from axios
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error(error.response.data);
                    console.error(error.response.status);
                    //if 404 not found from server -> we can delete the local dish from here
                    if (error.response.status == 404) {
                        setAvailableDishes(prev => prev.filter((dish) => dish.dishId != dishIdToDelete));
                        toastShow('Dish not found in db', 'I');
                    } else
                        toastShow('Error in deleting the dish. Check console log', 'E');
                    console.error(error.response.headers);
                } else {
                    toastShow('Error in deleting the dish. Check console log', 'E');
                }
            } else {
                toastShow('Error in deleting the dish. Check console log', 'E');
                console.error(error);
            }
        } finally {
            //enable the buttons again
            for (let i = 0; i < availableDishes.length; i++) {
                editDishButtons.current[i]?.removeAttribute("disabled");
                deleteDishButtons.current[i]?.removeAttribute("disabled");
            } 
        }        
    };
    
    //check the size of the uploaded image file (mut be 3MB MAX) and errors in uploading 
    const checkImage = (event: any, isAdd: boolean) => {
        let file = event.target.files[0];
        if (file.size > 3000000){
            toastShow("File size is too big", "E");
            isAdd ? setAddDishImageBase64(null) : setEditDishImageBase64(null);
            return;
        }
        
        var reader = new FileReader();
         reader.onload = function() {
            if (!this.result) {
                toastShow("Could not upload the file", "E");
                isAdd ? setAddDishImageBase64(null) : setEditDishImageBase64(null);
                return;
            }
            let fileStr = (this.result as string);
            let comma : number = fileStr.indexOf(',');
            if (comma == -1){
                toastShow("Could not upload the file", "E");
                isAdd ? setAddDishImageBase64(null) : setEditDishImageBase64(null);
                return;
            }
            var base64str = fileStr.substring(comma + 1);
            isAdd ? setAddDishImageBase64(base64str) : setEditDishImageBase64(base64str);
        }
        reader.readAsDataURL(file);
    };

    const addOrEditDishImageHandler = (event: any, isAdd: boolean) => {
        checkImage(event, isAdd);
    };


    return (
        <>
        <Header />
        {dishToEdit && 
            <Modal desiredWidth={"fit-content"} showModal={dishToEdit !== null} setShowModal={() => setDishToEdit(null)}>
                <AddEditDishForm preFilledValues={ {dish_name: dishToEdit.dish_name, price: dishToEdit.price, dish_description: dishToEdit.dish_description, dish_extended_description: dishToEdit.dish_extended_info}} addOrEditDishButton={editDishButton} addOrEditDish={editDish} addOrEditDishImageHandler={addOrEditDishImageHandler} isUsedForAdd={false}/>
            </Modal> 
            }
        <div id={adminStyle.main}>
            <div id={adminStyle.main_content}>
            <Tabs>
                <TabList>
                <Tab>Add Dish</Tab>
                <Tab>Edit Dishes</Tab>
                <Tab>Edit Users</Tab>
                </TabList>

                <TabPanel>
                    <AddEditDishForm preFilledValues={null} addOrEditDishButton={addDishButton} addOrEditDish={addDish} addOrEditDishImageHandler={addOrEditDishImageHandler} isUsedForAdd={true}/>
                </TabPanel>
                <TabPanel>
                    <div id={adminStyle.main_editdishes}>
                        {availableDishes.length == 0 && 
                        <div id={adminStyle.main_editdishes_error}>
                            <h1>No Dishes found</h1>
                            <img src={NoDishesPic}></img>
                        </div>
                        }
                        {availableDishes.length > 0 &&
                        <div id={adminStyle.main_editdishes_main}>
                            <ul>
                                {availableDishes.map((dish, index) => {
                                    return (
                                        <li key={dish.dishId} className={adminStyle.main_editdidhes_li}>
                                            <img id={adminStyle.main_editdishes_img} src={`data:image/*;charset=utf-8;base64,${dish.dish_image_base64}`}></img>
                                            <div id={adminStyle.main_editdishes_text}>
                                                <span id={adminStyle.main_editdishes_text_name}>{dish.dish_name}</span>
                                                <span id={adminStyle.main_editdishes_text_price}>Price: {dish.price}$</span>
                                                <span id={adminStyle.main_editdishes_text_description}>{dish.dish_description}</span>
                                            </div>
                                            <div id={adminStyle.main_editdishes_buttons}>
                                                <button ref={ref => (editDishButtons.current[index] = ref)} onClick = {() => {setDishToEdit(dish)}} id={adminStyle.main_editdishes_edit_btn}><img id={adminStyle.main_editdishes_edit_btn_img} src={IconEdit}></img></button>
                                                <button ref={ref => (deleteDishButtons.current[index] = ref)} onClick = {() => deleteDish(dish.dishId)} id={adminStyle.main_editdishes_delete_btn}><img id={adminStyle.main_editdishes_delete_btn_img}src={IconDelete}></img></button>
                                            </div>
                                        </li>
                                    )
                                })}
                                
                            </ul>
                        </div>
                        }
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