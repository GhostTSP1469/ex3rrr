import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { imageUrl } from "../shared/api/imageUrl";
import { useClearCartMutation, useGetCartQuery } from "../shared/api/storeApi";

export default function Checkout() {
  const navigate = useNavigate();
  const { data } = useGetCartQuery();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data?.[0];
  const items = cart?.productsInCart ?? [];
  const total = cart?.totalPrice ?? 0;

  // В этом API нет эндпоинта заказа, поэтому «Place Order» очищает корзину.
  async function placeOrder() {
    await clearCart();
    navigate("/");
  }

  return (
    <>
      <Header />

      <main className="container page-space checkout-page">
        <Breadcrumb items={["View Cart", "CheckOut"]} />

        <div className="checkout-layout">
          <section>
            <h1>Billing Details</h1>
            <form className="billing-card" onSubmit={(event) => event.preventDefault()}>
              <input placeholder="First name" />
              <input placeholder="Last name" />
              <input placeholder="Street address" />
              <input placeholder="Apartment, floor, etc. (optional)" />
              <input placeholder="Town/City" />
              <input placeholder="Phone number" />
              <input placeholder="Email address" />
              <label className="save-check">
                <input type="checkbox" defaultChecked />
                <span>Save this information for faster check-out next time</span>
              </label>
            </form>
          </section>

          <aside className="order-summary">
            {items.map((item) => (
              <div className="order-item" key={item.id}>
                <img src={imageUrl(item.product.image)} alt={item.product.productName} />
                <span>{item.product.productName}</span>
                <b>${item.product.price * item.quantity}</b>
              </div>
            ))}

            <p>
              <span>Subtotal:</span>
              <b>${total}</b>
            </p>
            <p>
              <span>Shipping:</span>
              <b>Free</b>
            </p>
            <hr />
            <p className="order-total">
              <span>Total:</span>
              <b>${total}</b>
            </p>

            <label className="pay-line">
              <input type="radio" name="payment" />
              <span>Bank</span>
            </label>
            <label className="pay-line">
              <input type="radio" name="payment" defaultChecked />
              <span>Cash on delivery</span>
            </label>

            <button
              className="primary-btn place-order"
              type="button"
              onClick={placeOrder}
              disabled={items.length === 0}
            >
              Place Order
            </button>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
