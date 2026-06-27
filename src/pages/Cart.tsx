import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button3D from "../components/Button3D";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCartColorStore } from "../store/cartColorStore";
import { resolveColor } from "../shared/colorMap";
import { imageUrl } from "../shared/api/imageUrl";
import {
  useClearCartMutation,
  useDeleteFromCartMutation,
  useGetCartQuery,
  useIncreaseCartMutation,
  useReduceCartMutation,
} from "../shared/api/storeApi";

export default function Cart() {
  const { data, isLoading } = useGetCartQuery();
  const cartColors = useCartColorStore((state) => state.colors);
  const cartSizes = useCartColorStore((state) => state.sizes);
  const [increase] = useIncreaseCartMutation();
  const [reduce] = useReduceCartMutation();
  const [deleteItem] = useDeleteFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data?.[0];
  const items = cart?.productsInCart ?? [];

  return (
    <>
      <Header />

      <main className="container page-space cart-page">
        <Breadcrumb items={["Cart"]} />

        {isLoading ? (
          <p className="state-text">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>Корзина пуста.</p>
            <Link to="/products" className="primary-btn">
              Return To Shop
            </Link>
          </div>
        ) : (
          <>
            <section className="cart-table">
              <div className="cart-head">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {items.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div className="cart-product">
                    <img src={imageUrl(item.product.image)} alt={item.product.productName} />
                    <div>
                      <span>{item.product.productName}</span>
                      <div className="cart-meta">
                        {cartColors[item.product.id] ? (
                          <span className="cart-color">
                            {(() => {
                              const c = resolveColor(cartColors[item.product.id]);
                              return (
                                <span
                                  className="swatch-dot"
                                  style={{ background: c.hex, color: c.known ? "transparent" : "#111" }}
                                >
                                  {c.known ? "" : c.letter}
                                </span>
                              );
                            })()}
                            {cartColors[item.product.id]}
                          </span>
                        ) : null}
                        {cartSizes[item.product.id] ? (
                          <span className="cart-size">Size: {cartSizes[item.product.id]}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <span>${item.product.price}</span>
                  <div className="flex items-center justify-center gap-2">
                    <Button3D onClick={() => reduce(item.id)} ariaLabel="Decrease">
                      ❮
                    </Button3D>
                    <span className="min-w-6 text-center text-lg font-semibold">{item.quantity}</span>
                    <Button3D onClick={() => increase(item.id)} ariaLabel="Increase">
                      ❯
                    </Button3D>
                  </div>
                  <strong>${item.product.price * item.quantity}</strong>
                  <label className="relative inline-flex cursor-pointer items-center" title="Remove">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      onChange={() => deleteItem(item.id)}
                    />
                    <div className="peer h-11 w-11 rounded-full bg-rose-400 shadow-md ring-0 outline-none duration-300 after:absolute after:left-1 after:top-1 after:flex after:h-9 after:w-9 after:-rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-50 after:duration-500 after:content-['✖️'] peer-checked:bg-emerald-500 peer-checked:after:rotate-0 peer-checked:after:content-['✔️'] peer-hover:after:scale-75 peer-focus:outline-none" />
                  </label>
                </div>
              ))}
            </section>

            <div className="cart-actions">
              <Link to="/products" className="outline-btn">
                Return To Shop
              </Link>
              <div>
                <button className="outline-red" type="button" onClick={() => clearCart()}>
                  Remove all
                </button>
              </div>
            </div>

            <section className="cart-bottom">
              <div />
              <div className="cart-total">
                <h2>Cart Total</h2>
                <p>
                  <span>Subtotal:</span>
                  <b>${cart?.totalPrice ?? 0}</b>
                </p>
                <p>
                  <span>Shipping:</span>
                  <b>Free</b>
                </p>
                <hr />
                <p className="total-line">
                  <span>Total:</span>
                  <b>${cart?.totalPrice ?? 0}</b>
                </p>
                <Link to="/checkout" className="primary-btn">
                  Procees to checkout
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
