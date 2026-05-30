import adminStyle from '../styles/AdminMenu.module.scss';
import Header from './Header';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toastShow } from '../other/ToastUtils';
import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from 'react';
import { createDishToAddFromForm, createDishToPut, createDishToPutFromAdd, createDishToPutFromForm, IDishToAdd, IDishToPut } from '../interfaces/DishInterfaces';
import { createUserFromForm, IUser } from '../interfaces/UserInterface';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoutes } from '../other/PublicSettings';
import NoDishesPic from '../media/sad_food.jpg';
import IconEdit from '../media/icon_edit.png';
import IconDelete from '../media/icon_delete.png';
import DishLoadingImage from '../media/dish_loading_skeleton.png';
import Modal from './Modal';
import AddEditDishForm from './AddEditDishForm';
import EditUserForm from './EditUserForm';
import { get, post, put, del, getDishImageUrl, getDishes } from '../other/utils';

const MAX_IMG_SIZE = 3000000;

const AdminMenu = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [availableDishes, setAvailableDishes] = useState<IDishToPut[]>([]);
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    // dishId -> image src (blob URL for fetched dishes, data URL for just-uploaded ones), kept separate from the payload
    const [dishImages, setDishImages] = useState<Record<number, string>>({});
    const [addDishImageBase64, setAddDishImageBase64] = useState<string | null>(null);
    const [editDishImageBase64, setEditDishImageBase64] = useState<string | null>(null);
    const [dishToEdit, setDishToEdit] = useState<IDishToPut | null>(null);
    const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
    const [dishDeleteConfirm, setDishDeleteConfirm] = useState<number>(-1); //-1 disable confirm, other value = dish id
    const [userDeleteConfirm, setUserDeleteConfirm] = useState<string>(""); //empty disable confirm, other value = user_id
    const [isBusy, setIsBusy] = useState<boolean>(false); //disables action buttons while a request is in flight

    //retrieve all the dishes (and their images, fetched together)
    const fetchDishes = useCallback(async () => {
        const dishes = await getDishes();
        if (!dishes.length) {
            toastShow('Could not fetch dishes', 'E');
            return;
        }
        setAvailableDishes(prev => [...prev, ...dishes.map(dish => createDishToPut(dish))]);
        const images = await Promise.all(
            dishes.map(async dish => [dish.dishId, dish.dish_url ? await getDishImageUrl(dish.dish_url) : ""] as const)
        );
        setDishImages(prev => ({ ...prev, ...Object.fromEntries(images) }));
    }, []);

    //retrieve all the users
    const getUsers = useCallback(async () => {
        try {
            const usersRet = await get<IUser[]>(ApiRoutes.GetUsers, await getAccessTokenSilently());
            setAvailableUsers(usersRet);
            return;
        } catch (error) {
            console.error(error);
        }
        toastShow('Could not fetch Users', 'E');
    }, [getAccessTokenSilently]);

    //get all the available dishes and users on startup
    useEffect(() => {
        fetchDishes();
        getUsers();
    }, [fetchDishes, getUsers]);

    //common function to update a User or Dish
    async function editItem<T>(
        apiRoute: string,
        itemToSend: T,
        getId: (item: T) => string | number,
        setItems: Dispatch<SetStateAction<T[]>>,
        setItemToEdit: Dispatch<SetStateAction<T | null>>
    ): Promise<void> {
        setIsBusy(true);
        try {
            await put<T, unknown>(apiRoute, itemToSend, await getAccessTokenSilently());
            toastShow('Item update success', "S");
            setItems(prev => prev.map(item => getId(item) === getId(itemToSend) ? itemToSend : item));
            setItemToEdit(null);
        } catch (error) {
            toastShow('Error in updating the item. Check console log', "E");
            console.error(error);
        } finally {
            setIsBusy(false);
        }
    }

    //common function to delete a User or Dish
    async function deleteItem<T>(
        idToDelete: string | number,
        apiRoute: string,
        getId: (item: T) => string | number,
        setItems: Dispatch<SetStateAction<T[]>>
    ): Promise<void> {
        setIsBusy(true);
        try {
            await del<unknown>(`${apiRoute}/${idToDelete}`, await getAccessTokenSilently());
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
            setIsBusy(false);
        }
    }

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
            setIsBusy(true);
            const newDishId = await post<IDishToAdd, number>(ApiRoutes.AddDish, dishToSend, await getAccessTokenSilently());
            toastShow('The Dish was successfully added to the database, with ID: ' + newDishId, 'S');
            //append to the local dishes and reuse the already-uploaded image for the thumbnail
            setAvailableDishes(prev => [...prev, createDishToPutFromAdd(dishToSend, newDishId)]);
            setDishImages(prev => ({ ...prev, [newDishId]: `data:image/*;base64,${addDishImageBase64}` }));
        } catch (error) {
            toastShow('Error in adding the dish. Check console log', 'E');
            console.error(error);
        } finally {
            setIsBusy(false);
        }
    };

    //when the user clicks EDIT DISH
    const editDish = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editDishImageBase64 === null) {
            toastShow("A valid image is required", "E");
            return;
        }
        const dishToPut = createDishToPutFromForm(event.target as HTMLFormElement, editDishImageBase64, dishToEdit!.dishId);
        await editItem(ApiRoutes.UpdateDish, dishToPut, dish => dish.dishId, setAvailableDishes, setDishToEdit);
        //reuse the freshly uploaded image for the thumbnail
        setDishImages(prev => ({ ...prev, [dishToPut.dishId]: `data:image/*;base64,${editDishImageBase64}` }));
    };

    //when the user clicks EDIT USER
    const editUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userToUpdate = createUserFromForm(event.target as HTMLFormElement, userToEdit!.user_id);
        await editItem(ApiRoutes.UpdateUser, userToUpdate, user => user.user_id, setAvailableUsers, setUserToEdit);
    };

    //when the user clicks DELETE DISH
    const deleteDish = (dishIdToDelete: number) =>
        deleteItem(dishIdToDelete, ApiRoutes.DeleteDish, (dish: IDishToPut) => dish.dishId, setAvailableDishes);

    //when the user clicks DELETE USER
    const deleteUser = (userToDelete: string) =>
        deleteItem(userToDelete, ApiRoutes.DeleteUser, (user: IUser) => user.user_id, setAvailableUsers);

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

    return (
        <>
            <Header />
            {dishToEdit &&
                <Modal desiredWidth={"fit-content"} showModal={dishToEdit !== null} closeModal={() => setDishToEdit(null)}>
                    <AddEditDishForm preFilledValues={{ dish_name: dishToEdit.dish_name, price: dishToEdit.price, dish_description: dishToEdit.dish_description, dish_extended_description: dishToEdit.dish_extended_info }} disabled={isBusy} addOrEditDish={editDish} addOrEditDishImageHandler={checkImage} isUsedForAdd={false} />
                </Modal>
            }
            {userToEdit &&
                <Modal desiredWidth={"32rem"} showModal={userToEdit !== null} closeModal={() => setUserToEdit(null)}>
                    <EditUserForm preFilledValues={{ email: userToEdit.email, user_name: userToEdit.name, user_lastname: userToEdit.lastName, location: userToEdit.address }} disabled={isBusy} editUser={editUser}></EditUserForm>
                </Modal>
            }
            {dishDeleteConfirm != -1 &&
                <Modal desiredWidth={"fit-content"} showModal={dishDeleteConfirm != -1} closeModal={() => setDishDeleteConfirm(-1)}>
                    <div id={adminStyle.deletedish_confirm_dialog}>
                        <h2>Are you sure you want to delete this Dish?</h2>
                        <div className={adminStyle.custom_button_container}>
                            <button className={adminStyle.custom_button} onClick={() => { setDishDeleteConfirm(-1); deleteDish(dishDeleteConfirm) }}>YES</button>
                            <button className={adminStyle.custom_button} onClick={() => setDishDeleteConfirm(-1)}>NO</button>
                        </div>
                    </div>
                </Modal>
            }
            {userDeleteConfirm != "" &&
                <Modal desiredWidth={"fit-content"} showModal={userDeleteConfirm != ""} closeModal={() => setUserDeleteConfirm("")}>
                    <div id={adminStyle.deletedish_confirm_dialog}>
                        <h2>Are you sure you want to delete this User?</h2>
                        <div className={adminStyle.custom_button_container}>
                            <button className={adminStyle.custom_button} onClick={() => { setUserDeleteConfirm(""); deleteUser(userDeleteConfirm) }}>YES</button>
                            <button className={adminStyle.custom_button} onClick={() => setUserDeleteConfirm("")}>NO</button>
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
                            <AddEditDishForm preFilledValues={null} disabled={isBusy} addOrEditDish={addDish} addOrEditDishImageHandler={checkImage} isUsedForAdd={true} />
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
                                            {availableDishes.map((dish) => {
                                                return (
                                                    <li key={dish.dishId} className={adminStyle.main_editdishes_li}>
                                                        <img id={adminStyle.main_editdishes_img} src={dishImages[dish.dishId] || DishLoadingImage}></img>
                                                        <div id={adminStyle.main_editdishes_text}>
                                                            <span id={adminStyle.main_editdishes_text_name}>{dish.dish_name}</span>
                                                            <span id={adminStyle.main_editdishes_text_price}>Price: {dish.price}$</span>
                                                            <span id={adminStyle.main_editdishes_text_description}>{dish.dish_description}</span>
                                                        </div>
                                                        <div>
                                                            <button disabled={isBusy} onClick={() => { setDishToEdit(dish) }} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                                            <button disabled={isBusy} onClick={() => setDishDeleteConfirm(dish.dishId)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img} src={IconDelete}></img></button>
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
                                        <ul>
                                            {availableUsers.map((user) => {
                                                return (
                                                    <li key={user.user_id} className={adminStyle.main_editusers_li}>
                                                        <div id={adminStyle.main_editusers_text}>
                                                            <span id={adminStyle.main_editusers_text_email}>{user.email}</span>
                                                            <span id={adminStyle.main_editusers_text_name}>{user.name}</span>
                                                            <span id={adminStyle.main_editusers_text_lastname}>{user.lastName}</span>
                                                            <span id={adminStyle.main_editusers_text_address}>Location: {user.address}</span>
                                                        </div>
                                                        <div>
                                                            <button disabled={isBusy} onClick={() => { setUserToEdit(user) }} id={adminStyle.main_edit_edit_btn}><img id={adminStyle.main_edit_edit_btn_img} src={IconEdit}></img></button>
                                                            <button disabled={isBusy} onClick={() => setUserDeleteConfirm(user.user_id)} id={adminStyle.main_edit_delete_btn}><img id={adminStyle.main_edit_delete_btn_img} src={IconDelete}></img></button>
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
