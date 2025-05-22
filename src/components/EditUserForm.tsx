import { FormEvent } from 'react';
import adminStyle from '../styles/AdminMenu.module.scss'

interface IEditUserFormProps {
    preFilledValues?: {
        email: string
        user_name: string,
        user_lastname: string,
        location: string,

    } | null,
    editUser(event: FormEvent<HTMLFormElement>): void,
    editUserButton: any,
}

const EditUserForm = ({ preFilledValues, editUser, editUserButton }: IEditUserFormProps) => {
    return (
        <div id={adminStyle.main_edit_user_form}>
            <form id={adminStyle.edit_user_form} onSubmit={(event) => editUser(event)}>
                <div id={adminStyle.edit_user_form1}>
                    <label htmlFor={adminStyle.edit_user_email} >Email</label>
                    <input id={adminStyle.edit_user_email} required type="text" maxLength={50} name="email" defaultValue={preFilledValues?.email}></input>
                </div>
                <div id={adminStyle.edit_user_form2}>
                    <label htmlFor={adminStyle.edit_user_name}>Name</label>
                    <input id={adminStyle.edit_user_name} required type="text" maxLength={50} name="name" defaultValue={preFilledValues?.user_name}></input>
                </div>
                <div id={adminStyle.edit_user_form3}>
                    <label htmlFor={adminStyle.edit_user_lastname}>Last Name</label>
                    <input id={adminStyle.edit_user_lastname} required type="text" maxLength={50} name="lastname" defaultValue={preFilledValues?.user_lastname}></input>
                </div>
                <div id={adminStyle.edit_user_form4}>
                    <label htmlFor={adminStyle.edit_user_address}>Location</label>
                    <input id={adminStyle.edit_user_address} required type="text" maxLength={50} name="address" defaultValue={preFilledValues?.location}></input>
                </div>
                <div id={adminStyle.edit_user_form5}>
                    <button type="submit" ref={editUserButton} className={adminStyle.custom_button}>Edit User</button>
                </div>
            </form>
        </div>
    );
}

export default EditUserForm;