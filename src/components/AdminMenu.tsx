import adminStyle from '../styles/AdminMenu.module.css';
import Header from './Header';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toastShow } from '../other/ToastUtils';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { createDishToAddFromForm, createDishToPut, createDishToPutFromAdd, createDishToPutFromForm, IDish, IDishToAdd, IDishToPut } from '../interfaces/DishInterfaces';
import { createUserFromForm, IUser } from '../interfaces/UserInterface';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoutes, OtherRoutes, Settings } from '../other/PublicSettings';
import NoDishesPic from '../media/sad_food.jpg';
import IconEdit from '../media/icon_edit.png';
import IconDelete from '../media/icon_delete.png';
import Modal from './Modal';
import AddEditDishForm from './AddEditDishForm';
import EditUserForm from './EditUserForm';
import {get, post, put, del} from '../other/utils';

const AdminMenu = () => {
    const MAX_IMG_SIZE = 3000000;

    const {getAccessTokenSilently} = useAuth0();
    const [availableDishes, setAvailableDishes] = useState<IDishToPut[]>([]);
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    const [addDishImageBase64, setAddDishImageBase64] = useState<string | null>(null);
    const [editDishImageBase64, setEditDishImageBase64] = useState<string | null>(null);
    const [dishToEdit, setDishToEdit] = useState<IDishToPut | null>(null);
    const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
    const [dishDeleteConfirm, setDishDeleteConfirm] = useState<number>(-1); //-1 disable confirm, other value = dish id
    const [userDeleteConfirm, setUserDeleteConfirm] = useState<string>(""); //empty disable confirm, other value = user_id
    //add dish, edit dish modal, edit user modal buttons
    const addDishButton = useRef<HTMLButtonElement | null>(null);
    const editDishButton = useRef<HTMLButtonElement | null>(null);
    const editUserButton = useRef<HTMLButtonElement | null>(null);
    //edit dishes edit/delete buttons
    const editDishButtons = useRef<(HTMLButtonElement | null)[]>([]);
    const deleteDishButtons = useRef<(HTMLButtonElement | null)[]>([]);
    //edit users edit/delete buttons
    const editUserButtons = useRef<(HTMLButtonElement | null)[]>([]);
    const deleteUserButtons = useRef<(HTMLButtonElement | null)[]>([]);
    
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
                            let b64img = "";
                            try {
                                const responseImage = await axios.get(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dish.dish_url}`, { responseType:"arraybuffer" });
                                //convert to base64
                                b64img = btoa(new Uint8Array(responseImage.data).reduce((data, byte) => data + String.fromCharCode(byte),''));
                            } catch (error) { }
                            dishes.push(createDishToPut(dish, b64img));
                        }));
                        setAvailableDishes([...availableDishes, ...dishes ]);
                        return;
                    }
                } catch (error) {
                    console.error(error);
                }
                toastShow('Could not fetch dishes', 'E');
            };

            getDishes();
        }
        //again, this should run ONLY once to fetch all the users from db at first, if somehow it runs again, don't do anything
        if (availableUsers.length == 0) {
            const getUsers = async() => {
                try {
                    const usersRet = await get<IUser[] | null>(ApiRoutes.GetUsers, await getAccessTokenSilently());
                    setAvailableUsers(usersRet ?? []);
                    return;
                } catch (error) {
                    console.error(error);
                }
                toastShow('Could not fetch Users', 'E');
            };

            getUsers();
        }
    }, []);
    
    //when the user clicks ADD DISH
    const addDish = async(event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (addDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        const dishToSend = createDishToAddFromForm(event.target as HTMLFormElement, addDishImageBase64);

        //send http POST request
        try {
            if (addDishButton.current)
                addDishButton.current.setAttribute("disabled", "true");
            const newDishId = await post<IDishToAdd, number>(ApiRoutes.AddDish, dishToSend, await getAccessTokenSilently());
            toastShow('The Dish was successfully added to the database, with ID: ' + newDishId, 'S');
            //append to the local dishes
            setAvailableDishes((prev) => ([...prev, createDishToPutFromAdd(dishToSend, newDishId)]));
        } catch (error) {
            toastShow('Error in adding the dish. Check console log', 'E');
            console.error(error);
        } finally {
            if (addDishButton.current)
                addDishButton.current.removeAttribute("disabled");
        }
    };

    const editDish = async(event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        //disable edit dish button while the operation is in progress
        editDishButton.current!.setAttribute("disabled", "true");

        const dishToSend = createDishToPutFromForm(event.target as HTMLFormElement, editDishImageBase64, dishToEdit!.dishId)
        //send http PUT request
        try {
            await put<IDishToPut, any>(ApiRoutes.UpdateDish, dishToSend,  await getAccessTokenSilently());
            toastShow('Dish update success', 'S');
            //update this specific dish locally, and then re-render
            setAvailableDishes(prev => prev.map(dish => dish.dishId === dishToSend.dishId ? dishToSend : dish));
            setDishToEdit(null);
        } catch (error) {
            toastShow('Error in updating the dish. Check console log', 'E');
            console.error(error);
        } finally {
            //enable the button again
            editDishButton.current!.removeAttribute("disabled");
        }
    };

    const editUser = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //disable edit user button while the operation is in progress
        editUserButton.current!.setAttribute("disabled", "true");
        const userToSend = createUserFromForm(event.target as HTMLFormElement, userToEdit!.user_id);
        //send http PUT request
        try {
            await put<IUser, any>(ApiRoutes.UpdateUser, userToSend, await getAccessTokenSilently());
            toastShow('User update success', 'S');
            //update this specific user locally, and then re-render
            setAvailableUsers(prev => prev.map(user => user.user_id === userToSend.user_id ? userToSend : user));
            setUserToEdit(null);
        } catch (error) {
            toastShow('Error in updating the user. Check console log', 'E');
            console.error(error);
        } finally {
            //enable the button again
            editUserButton.current!.removeAttribute("disabled");
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
            await del<any>(`${ApiRoutes.DeleteDish}/${dishIdToDelete}`, await getAccessTokenSilently());
            toastShow('Dish delete success', 'S');
            setAvailableDishes(prev => prev.filter((dish) => dish.dishId != dishIdToDelete));
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const { status, data, headers } = error.response;
                console.error('Axios error: ', data, status, headers);
                if (status === 404) {
                    setAvailableDishes(prev => prev.filter(dish => dish.dishId !== dishIdToDelete));
                    toastShow('Dish not found in db', 'I');
                    return;
                }
                toastShow('Error in deleting the dish. Check console log', 'E');
                return;
            }
            toastShow('Error in deleting the dish. Check console log', 'E');
        } finally {
            //enable the buttons again
            for (let i = 0; i < availableDishes.length; i++) {
                editDishButtons.current[i]?.removeAttribute("disabled");
                deleteDishButtons.current[i]?.removeAttribute("disabled");
            } 
        }        
    };

    const deleteUser = async(userToDelete: string) => {
        //disable all buttons while the Delete operation is in progress
        for (let i = 0; i < availableUsers.length; i++) {
            editUserButtons.current[i]?.setAttribute("disabled", "true");
            deleteUserButtons.current[i]?.setAttribute("disabled", "true");
        } 

        //send http DELETE request
        try {
            del<any>(`${ApiRoutes.DeleteUser}/${userToDelete}`, await getAccessTokenSilently());
            toastShow('User delete success', 'S');
            setAvailableUsers(prev => prev.filter((user) => user.user_id != userToDelete));
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const { status, data, headers } = error.response;
                console.error('Axios error: ', data, status, headers);
                if (status === 404) {
                    setAvailableUsers(prev => prev.filter(user => user.user_id !== userToDelete));
                    toastShow('User not found in db', 'I');
                    return;
                }
                toastShow('Error in deleting the user. Check console log', 'E');
                return;
            }
            toastShow('Error in deleting the user. Check console log', 'E');
        } finally {
            //enable the buttons again
            for (let i = 0; i < availableDishes.length; i++) {
                editUserButtons.current[i]?.removeAttribute("disabled");
                deleteUserButtons.current[i]?.removeAttribute("disabled");
            } 
        }        
    };
    
    //check the size of the uploaded image file and errors in uploading 
    const checkImage = (event: React.ChangeEvent<HTMLInputElement>, isAdd: boolean) => {
        const file = event.target.files?.[0];
        const setImage = isAdd ? setAddDishImageBase64 : setEditDishImageBase64;
        if (!file) 
            return;
        if (file.size > MAX_IMG_SIZE) {
            toastShow("File is invalid or size is too big", "E");
            setImage(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string" || !result.includes(",")) {
                toastShow("Could not upload the file", "E");
                setImage(null);
                return;
            }
            const base64str = result.split(",")[1];
            setImage(base64str);
        };
        reader.readAsDataURL(file);
    };

    const addOrEditDishImageHandler = (event: React.ChangeEvent<HTMLInputElement>, isAdd: boolean) => checkImage(event, isAdd);

    return (
        <>
        <Header />
        {dishToEdit && 
            <Modal desiredWidth={"fit-content"} showModal={dishToEdit !== null} closeModal={() => setDishToEdit(null)}>
                <AddEditDishForm preFilledValues={ {dish_name: dishToEdit.dish_name, price: dishToEdit.price, dish_description: dishToEdit.dish_description, dish_extended_description: dishToEdit.dish_extended_info}} addOrEditDishButton={editDishButton} addOrEditDish={editDish} addOrEditDishImageHandler={addOrEditDishImageHandler} isUsedForAdd={false}/>
            </Modal> 
        }
        {userToEdit && 
            <Modal desiredWidth={"32rem"} showModal={userToEdit !== null} closeModal={() => setUserToEdit(null)}>
               <EditUserForm preFilledValues={ {email: userToEdit.email, user_name: userToEdit.name, user_lastname: userToEdit.lastName, location: userToEdit.address} } editUserButton={editUserButton} editUser={editUser}></EditUserForm>
            </Modal> 
        }
        {dishDeleteConfirm != -1 &&
            <Modal desiredWidth={"fit-content"} showModal={dishDeleteConfirm != -1} closeModal={() => setDishDeleteConfirm(-1)}>
                <div id={adminStyle.deletedish_confirm_dialog}>
                    <h2>Are you sure you want to delete this Dish?</h2>
                    <div>
                        <button className={adminStyle.custom_button} onClick={() => { setDishDeleteConfirm(-1); deleteDish(dishDeleteConfirm) }}>YES</button>
                        <button style={{marginLeft : "5px"}}className={adminStyle.custom_button} onClick={() => setDishDeleteConfirm(-1)}>NO</button>
                    </div>
                </div>
            </Modal> 
        }
        {userDeleteConfirm != "" &&
            <Modal desiredWidth={"fit-content"} showModal={userDeleteConfirm != ""} closeModal={() => setUserDeleteConfirm("")}>
                <div id={adminStyle.deletedish_confirm_dialog}>
                    <h2>Are you sure you want to delete this User?</h2>
                    <div>
                        <button className={adminStyle.custom_button} onClick={() => { setUserDeleteConfirm(""); deleteUser(userDeleteConfirm) }}>YES</button>
                        <button style={{marginLeft : "5px"}}className={adminStyle.custom_button} onClick={() => setUserDeleteConfirm("")}>NO</button>
                    </div>
                </div>
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
                    <div className={adminStyle.main_edit}>
                        {availableDishes.length == 0 && 
                        <div className={adminStyle.main_edit_error}>
                            <h1>No Dishes found</h1>
                            <img src={NoDishesPic}></img>
                        </div>
                        }
                        {availableDishes.length > 0 &&
                        <div className={adminStyle.main_edit_main}>
                            <ul>
                                {availableDishes.map((dish, index) => {
                                    return (
                                        <li key={dish.dishId} className={adminStyle.main_editdishes_li}>
                                            <img id={adminStyle.main_editdishes_img} src={`data:image/*;charset=utf-8;base64,${dish.dish_image_base64}`}></img>
                                            <div id={adminStyle.main_editdishes_text}>
                                                <span id={adminStyle.main_editdishes_text_name}>{dish.dish_name}</span>
                                                <span id={adminStyle.main_editdishes_text_price}>Price: {dish.price}$</span>
                                                <span id={adminStyle.main_editdishes_text_description}>{dish.dish_description}</span>
                                            </div>
                                            <div>
                                                <button ref={ref => (editDishButtons.current[index] = ref)} onClick = {() => {setDishToEdit(dish)}} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                                <button ref={ref => (deleteDishButtons.current[index] = ref)} onClick = {() => setDishDeleteConfirm(dish.dishId)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img}src={IconDelete}></img></button>
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
                    <div className={adminStyle.main_edit}>
                    {availableUsers.length == 0 && 
                        <div className={adminStyle.main_edit_error}>
                            <h1>No Users found</h1>
                            <img src={NoDishesPic}></img>
                        </div>
                        }
                        {availableUsers.length > 0 &&
                        <div className={adminStyle.main_edit_main}>
                            <ul style={{paddingLeft: "5px"}}>
                                {availableUsers.map((user, index) => {
                                    return (
                                        <li key={user.user_id} className={adminStyle.main_editusers_li}>
                                        <div id={adminStyle.main_editusers_text}>
                                            <span id={adminStyle.main_editusers_text_email}>{user.email}</span>
                                            <span id={adminStyle.main_editusers_text_name}>{user.name}</span>
                                            <span id={adminStyle.main_editusers_text_lastname}>{user.lastName}</span>
                                            <span id={adminStyle.main_editusers_text_address}>Location: {user.address}</span>
                                        </div>
                                        <div>
                                            <button ref={ref => (editUserButtons.current[index] = ref)} onClick = {() => {setUserToEdit(user)}} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                            <button ref={ref => (deleteUserButtons.current[index] = ref)} onClick = {() => setUserDeleteConfirm(user.user_id)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img}src={IconDelete}></img></button>
                                        </div>
                                    </li>
                                    )
                                })}
                                
                            </ul>
                        </div>
                        }
                    </div>
                </TabPanel>
            </Tabs>
            </div>
        </div>
    </>
    );
}
export default AdminMenu;