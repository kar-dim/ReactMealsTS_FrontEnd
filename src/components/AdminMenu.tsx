import adminStyle from '../styles/AdminMenu.module.scss';
import Header from './Header';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toastShow } from '../other/ToastUtils';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { createDishToAddFromForm, createDishToPut, createDishToPutFromAdd, createDishToPutFromForm, IDishToAdd, IDishToPut } from '../interfaces/DishInterfaces';
import { createUserFromForm, IUser } from '../interfaces/UserInterface';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoutes } from '../other/PublicSettings';
import NoDishesPic from '../media/sad_food.jpg';
import IconEdit from '../media/icon_edit.png';
import IconDelete from '../media/icon_delete.png';
import Modal from './Modal';
import AddEditDishForm from './AddEditDishForm';
import EditUserForm from './EditUserForm';
import { get, post, put, del, getDishImage, getDishes } from '../other/utils';

function makeDeleteParams<T>(
    idToDelete: string | number,
    items: T[],
    apiRoute: string,
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    getId: (item: T) => string | number,
    editButton: React.MutableRefObject<(HTMLElement | null)[]>,
    delButton: React.MutableRefObject<(HTMLElement | null)[]>,
) { return { idToDelete, items, apiRoute, setItems, getId, editButton, delButton }; };

function makeEditParams<T>(
    buttonRef: React.RefObject<HTMLButtonElement>,
    itemToSend: T,
    apiRoute: string,
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    getId: (item: T) => any,
    setItemToEdit: React.Dispatch<React.SetStateAction<T | null>>
) { return { buttonRef, itemToSend, apiRoute, setItems, getId, setItemToEdit }; };

const AdminMenu = () => {
    const MAX_IMG_SIZE = 3000000;

    const { getAccessTokenSilently } = useAuth0();
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

    //get all the available dishes and users on startup
    useEffect(() => {
        if (availableDishes.length == 0)
            fetchDishes();
        if (availableUsers.length == 0)
            getUsers();
    }, []);

    //retrive all the dishes
    const fetchDishes = async () => {
        const dishes = await getDishes();
        if (!dishes.length) {
            toastShow('Could not fetch dishes', 'E');
            return;
        }
        const dishesWithImg = await Promise.all(dishes.map(async (dish) => createDishToPut(dish, await getDishImage(dish.dish_url!))));
        setAvailableDishes([...availableDishes, ...dishesWithImg]);
    };

    //retrieve all the users
    const getUsers = async () => {
        try {
            const usersRet = await get<IUser[]>(ApiRoutes.GetUsers, await getAccessTokenSilently());
            setAvailableUsers(usersRet);
            return;
        } catch (error) {
            console.error(error);
        }
        toastShow('Could not fetch Users', 'E');
    };

    //when the user clicks ADD DISH
    const addDish = async (event: FormEvent<HTMLFormElement>) => {
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

    //common function to update a User or Dish
    async function editItem<T>(params: ReturnType<typeof makeEditParams<T>>): Promise<void> {
        const { buttonRef, itemToSend, apiRoute, getId, setItems, setItemToEdit } = params;
        buttonRef.current?.setAttribute("disabled", "true");
        try {
            await put<T, any>(apiRoute, itemToSend, await getAccessTokenSilently());
            toastShow('Item update success', "S");
            setItems(prev => prev.map(item => getId(item) === getId(itemToSend) ? itemToSend : item));
            setItemToEdit(null);
        } catch (error) {
            toastShow('Error in updating the item. Check console log', "E");
            console.error(error);
        } finally {
            buttonRef.current?.removeAttribute("disabled");
        }
    }
    //common function to delete a User or Dish
    async function deleteItem<T>(params: ReturnType<typeof makeDeleteParams<T>>): Promise<void> {
        const { idToDelete, apiRoute, setItems, getId, editButton, delButton, items, } = params
        // Disable buttons while the operation is running
        for (let i = 0; i < items.length; i++) {
            editButton.current[i]?.setAttribute("disabled", "true");
            delButton.current[i]?.setAttribute("disabled", "true");
        }
        try {
            await del<any>(`${apiRoute}/${idToDelete}`, await getAccessTokenSilently());
            toastShow('Item delete success', 'S');
            setItems(prev => prev.filter(item => getId(item) !== idToDelete));
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const { status, data, headers } = error.response;
                console.error('Axios error:', data, status, headers);
                //if status is HTTP NOT FOUND, then delete from the UI the item, it does not exist on the backend
                if (status === 404) {
                    setItems(prev => prev.filter(item => getId(item) !== idToDelete));
                    toastShow('Item not found in db', 'I');
                    return;
                }
            }
            toastShow(`Error in deleting the item. Check console log`, 'E');
        } finally {
            // Re-enable buttons
            for (let i = 0; i < items.length; i++) {
                editButton.current[i]?.removeAttribute("disabled");
                delButton.current[i]?.removeAttribute("disabled");
            }
        }
    };

    //when the user clicks EDIT DISH
    const editDish = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        const dishToPut = createDishToPutFromForm(event.target as HTMLFormElement, editDishImageBase64!, dishToEdit!.dishId)
        await editItem(makeEditParams(editDishButton, dishToPut, ApiRoutes.UpdateDish, setAvailableDishes, dish => dish.dishId, setDishToEdit));
    };

    //when the user clicks EDIT USER
    const editUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userToUpdate = createUserFromForm(event.target as HTMLFormElement, userToEdit!.user_id);
        await editItem(makeEditParams(editUserButton, userToUpdate, ApiRoutes.UpdateUser, setAvailableUsers, user => user.user_id, setUserToEdit));
    }

    //when the user clicks DELETE DISH
    const deleteDish = async (dishIdToDelete: number) =>
        await deleteItem(makeDeleteParams(dishIdToDelete, availableDishes, ApiRoutes.DeleteDish, setAvailableDishes, dish => dish.dishId, editDishButtons, deleteDishButtons));

    //when the user clicks DELETE USER
    const deleteUser = async (userToDelete: string) =>
        await deleteItem(makeDeleteParams(userToDelete, availableUsers, ApiRoutes.DeleteUser, setAvailableUsers, user => user.user_id, editUserButtons, deleteUserButtons));

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
                    <AddEditDishForm preFilledValues={{ dish_name: dishToEdit.dish_name, price: dishToEdit.price, dish_description: dishToEdit.dish_description, dish_extended_description: dishToEdit.dish_extended_info }} addOrEditDishButton={editDishButton} addOrEditDish={editDish} addOrEditDishImageHandler={addOrEditDishImageHandler} isUsedForAdd={false} />
                </Modal>
            }
            {userToEdit &&
                <Modal desiredWidth={"32rem"} showModal={userToEdit !== null} closeModal={() => setUserToEdit(null)}>
                    <EditUserForm preFilledValues={{ email: userToEdit.email, user_name: userToEdit.name, user_lastname: userToEdit.lastName, location: userToEdit.address }} editUserButton={editUserButton} editUser={editUser}></EditUserForm>
                </Modal>
            }
            {dishDeleteConfirm != -1 &&
                <Modal desiredWidth={"fit-content"} showModal={dishDeleteConfirm != -1} closeModal={() => setDishDeleteConfirm(-1)}>
                    <div id={adminStyle.deletedish_confirm_dialog}>
                        <h2>Are you sure you want to delete this Dish?</h2>
                        <div>
                            <button className={adminStyle.custom_button} onClick={() => { setDishDeleteConfirm(-1); deleteDish(dishDeleteConfirm) }}>YES</button>
                            <button style={{ marginLeft: "5px" }} className={adminStyle.custom_button} onClick={() => setDishDeleteConfirm(-1)}>NO</button>
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
                            <button style={{ marginLeft: "5px" }} className={adminStyle.custom_button} onClick={() => setUserDeleteConfirm("")}>NO</button>
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
                            <AddEditDishForm preFilledValues={null} addOrEditDishButton={addDishButton} addOrEditDish={addDish} addOrEditDishImageHandler={addOrEditDishImageHandler} isUsedForAdd={true} />
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
                                                            <button ref={ref => (editDishButtons.current[index] = ref)} onClick={() => { setDishToEdit(dish) }} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                                            <button ref={ref => (deleteDishButtons.current[index] = ref)} onClick={() => setDishDeleteConfirm(dish.dishId)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img} src={IconDelete}></img></button>
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
                                        <ul style={{ paddingLeft: "5px" }}>
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
                                                            <button ref={ref => (editUserButtons.current[index] = ref)} onClick={() => { setUserToEdit(user) }} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                                            <button ref={ref => (deleteUserButtons.current[index] = ref)} onClick={() => setUserDeleteConfirm(user.user_id)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img} src={IconDelete}></img></button>
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