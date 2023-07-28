import './CartModal.css';
import CartDetails from './CartDetails';

interface ICartModal {
    showModal : boolean;
    setShowModal(show : boolean) : void;
};

//TODO: hide if clicked OUTSIDE!
const CartModal = ({showModal, setShowModal} : ICartModal) => {
    let showModalClass = showModal ? "cart_modal cart_show_modal" : "cart_modal";
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content">
                <span onClick={() => setShowModal(false)} className="cart_modal_close_button">&times;</span>
                <CartDetails closeModal={() => setShowModal(false)}/>
            </div>
        </div>
    );
};

export default CartModal;