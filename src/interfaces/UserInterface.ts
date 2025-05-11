export interface IUser {
    user_id: string,
    email: string,
    name: string,
    lastName: string,
    address: string
}

//helper converter functions
export const createUserFromForm = (form: HTMLFormElement, userId: string): IUser => ({
    user_id: userId,
    name: (form.elements.namedItem('name') as HTMLInputElement).value,
    lastName: (form.elements.namedItem('lastname') as HTMLInputElement).value,
    email: (form.elements.namedItem('email') as HTMLInputElement).value,
    address: (form.elements.namedItem('address') as HTMLInputElement).value,
});