import { useEffect, useMemo, useState, type FormEvent } from "react";
import { imageUrl } from "../../shared/api/imageUrl";
import { useNotifStore } from "../../store/notificationsStore";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetColorsQuery,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
  type Brand,
  type Color,
  type Product,
} from "../../shared/api/storeApi";
import ConfirmDialog from "../ConfirmDialog";

interface SubCat {
  id: number;
  subCategoryName: string;
  categoryName: string;
}

interface EditModalProps {
  product: Product;
  brands: Brand[];
  colors: Color[];
  subCategories: SubCat[];
  onClose: () => void;
}

const inputCls =
  "rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

const labelCls = "mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400";

// синий info пушим один раз за сессию (а не на каждый ре-рендер)
let infoLogged = false;

function EditProductModal({ product, brands, colors, subCategories, onClose }: EditModalProps) {
  const { data } = useGetProductByIdQuery(product.id);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const push = useNotifStore((state) => state.push);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    ProductName: product.productName,
    Code: "",
    Description: "",
    Price: product.price,
    Quantity: product.quantity,
    DiscountPrice: product.discountPrice,
    HasDiscount: product.hasDiscount,
    BrandId: 0,
    ColorId: 0,
    SubCategoryId: 0,
  });

  useEffect(() => {
    const detail = data?.data;
    if (!detail) return;
    setForm({
      ProductName: detail.productName,
      Code: detail.code,
      Description: detail.description,
      Price: detail.price,
      Quantity: detail.quantity,
      DiscountPrice: detail.discountPrice,
      HasDiscount: detail.hasDiscount,
      BrandId: brands.find((b) => b.brandName === detail.brand)?.id ?? 0,
      ColorId: colors.find((c) => c.colorName === detail.color)?.id ?? 0,
      SubCategoryId: detail.subCategoryId,
    });
  }, [data, brands, colors]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    // Баг бэкенда: update проверяет уникальность Code и спотыкается о собственный код товара.
    // Если код не меняли — добавляем короткий суффикс, чтобы проверка прошла.
    const originalCode = (data?.data?.code ?? "").trim();
    const codeToSend =
      form.Code.trim() === originalCode ? `${form.Code}-${Date.now().toString(36)}` : form.Code;
    try {
      await updateProduct({
        Id: product.id,
        ProductName: form.ProductName,
        Code: codeToSend,
        Description: form.Description || "-",
        Price: Number(form.Price),
        Quantity: Number(form.Quantity),
        DiscountPrice: Number(form.DiscountPrice),
        HasDiscount: form.HasDiscount,
        BrandId: Number(form.BrandId),
        ColorId: Number(form.ColorId),
        SubCategoryId: Number(form.SubCategoryId),
      }).unwrap();
      push("edit", form.ProductName, product.id);
      onClose();
    } catch (err) {
      setError((err as { message?: string }).message ?? "Не удалось обновить товар");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg space-y-3 rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Edit product</h3>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={labelCls}>Название товара</span>
            <input className={`w-full ${inputCls}`} value={form.ProductName} onChange={(e) => set("ProductName", e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls}>Артикул / Code</span>
            <input className={`w-full ${inputCls}`} value={form.Code} onChange={(e) => set("Code", e.target.value)} />
          </label>
        </div>

        <label className="block">
          <span className={labelCls}>Описание</span>
          <textarea className={`w-full ${inputCls}`} rows={2} value={form.Description} onChange={(e) => set("Description", e.target.value)} />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className={labelCls}>Цена, $</span>
            <input className={`w-full ${inputCls}`} type="text" inputMode="numeric" value={form.Price} onChange={(e) => set("Price", Number(e.target.value))} />
          </label>
          <label className="block">
            <span className={labelCls}>Количество на складе</span>
            <input className={`w-full ${inputCls}`} type="text" inputMode="numeric" value={form.Quantity} onChange={(e) => set("Quantity", Number(e.target.value))} />
          </label>
          <label className="block">
            <span className={labelCls}>Цена со скидкой</span>
            <input className={`w-full ${inputCls}`} type="text" inputMode="numeric" value={form.DiscountPrice} onChange={(e) => set("DiscountPrice", Number(e.target.value))} />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className={labelCls}>Бренд</span>
            <select className={`w-full ${inputCls}`} value={form.BrandId} onChange={(e) => set("BrandId", Number(e.target.value))}>
              <option value={0} disabled>Выбери бренд</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.brandName}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Цвет</span>
            <select className={`w-full ${inputCls}`} value={form.ColorId} onChange={(e) => set("ColorId", Number(e.target.value))}>
              <option value={0} disabled>Выбери цвет</option>
              {colors.map((c) => <option key={c.id} value={c.id}>{c.colorName}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Подкатегория</span>
            <select className={`w-full ${inputCls}`} value={form.SubCategoryId} onChange={(e) => set("SubCategoryId", Number(e.target.value))}>
              <option value={0} disabled>Выбери подкатегорию</option>
              {subCategories.map((s) => <option key={s.id} value={s.id}>{s.subCategoryName} ({s.categoryName})</option>)}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={form.HasDiscount} onChange={(e) => set("HasDiscount", e.target.checked)} />
          Есть скидка (показывать старую цену зачёркнутой)
        </label>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetProductsQuery({ PageNumber: page, PageSize: 12 });
  const { data: brands } = useGetBrandsQuery();
  const { data: colors } = useGetColorsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const push = useNotifStore((state) => state.push);
  const highlight = useNotifStore((state) => state.highlight);
  const setHighlight = useNotifStore((state) => state.setHighlight);

  const totalPage = data?.totalPage ?? 1;
  const totalRecord = data?.totalRecord ?? 0;

  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [toEdit, setToEdit] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");

  const products = data?.data?.products ?? [];

  // синий info-алерт: данные админки загрузились без ошибок (один раз за сессию)
  useEffect(() => {
    if (data && !infoLogged) {
      infoLogged = true;
      push("info", "Данные админ-панели загружены без ошибок");
    }
  }, [data, push]);

  // подсветка-мигание товара после перехода из уведомления, потом сброс
  useEffect(() => {
    if (!highlight) return;
    const timer = setTimeout(() => setHighlight(null), 2600);
    return () => clearTimeout(timer);
  }, [highlight, setHighlight]);

  // Подкатегории берём из категорий (у каждой есть subCategories)
  const subCategories = useMemo(
    () =>
      (categories?.data ?? []).flatMap((category) =>
        category.subCategories.map((sub) => ({ ...sub, categoryName: category.categoryName })),
      ),
    [categories],
  );

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const file = form.get("image") as File | null;
    if (!file || file.size === 0) {
      setError("Добавь изображение");
      return;
    }

    // Code должен быть уникальным — добавляем суффикс, иначе сервер падает на дубликате.
    const baseCode = String(form.get("code") ?? "").trim() || "P";
    const productName = String(form.get("productName"));
    const body = new FormData();
    body.append("Images", file);
    body.append("ProductName", productName);
    body.append("Code", `${baseCode}-${Date.now().toString(36)}`);
    body.append("Description", String(form.get("description") || "-"));
    body.append("Price", String(form.get("price")));
    body.append("Quantity", String(form.get("quantity")));
    body.append("BrandId", String(form.get("brandId")));
    body.append("ColorId", String(form.get("colorId")));
    body.append("SubCategoryId", String(form.get("subCategoryId")));
    body.append("HasDiscount", "false");

    try {
      const res = await addProduct(body).unwrap();
      push("add", productName, res.data);
      setShowAdd(false);
    } catch (err) {
      const failure = err as { status?: number; message?: string };
      const raw = failure.message ?? "";
      setError(
        failure.status === 500 || raw.includes("entity changes")
          ? "Сервер не смог сохранить товар. Проверь, что выбраны бренд, цвет и подкатегория, и попробуй ещё раз."
          : raw || "Не удалось создать товар",
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add product
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Inventory</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 ${
                    highlight?.id === product.id
                      ? highlight.type === "add"
                        ? "animate-[blinkGreen_0.7s_ease-in-out_3]"
                        : "animate-[blinkYellow_0.7s_ease-in-out_3]"
                      : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageUrl(product.image)}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-100">{product.productName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {product.quantity > 0 ? (
                      <span className="text-slate-600 dark:text-slate-300">{product.quantity} in stock</span>
                    ) : (
                      <span className="rounded bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs text-slate-500 dark:text-slate-400">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{product.categoryName || "—"}</td>
                  <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">${product.price}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setToEdit(product)}
                        className="rounded-lg border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/15"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(product)}
                        className="rounded-lg border border-red-200 dark:border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPage > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40"
            >
              ←
            </button>
            <span className="px-2">
              Page {page} / {totalPage}
            </span>
            <button
              type="button"
              disabled={page >= totalPage}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40"
            >
              →
            </button>
          </div>
          <span>{totalRecord} products</span>
        </div>
      ) : null}

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAdd(false)}>
          <form
            onSubmit={handleAdd}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg space-y-3 rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add new product</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Заполни все поля и прикрепи изображение. Бренд, цвет и подкатегорию создай заранее во вкладке Other.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Название товара</span>
                <input name="productName" required placeholder="например iPhone 15 Pro" className={`w-full ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>Артикул / Code</span>
                <input name="code" placeholder="любой код (станет уникальным)" className={`w-full ${inputCls}`} />
              </label>
            </div>

            <label className="block">
              <span className={labelCls}>Описание</span>
              <textarea name="description" rows={2} placeholder="короткое описание товара" className={`w-full ${inputCls}`} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Цена, $</span>
                <input name="price" type="text" inputMode="numeric" required placeholder="например 999" className={`w-full ${inputCls}`} />
              </label>
              <label className="block">
                <span className={labelCls}>Количество на складе</span>
                <input name="quantity" type="text" inputMode="numeric" required placeholder="например 50" className={`w-full ${inputCls}`} />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className={labelCls}>Бренд</span>
                <select name="brandId" required defaultValue="" className={`w-full ${inputCls}`}>
                  <option value="" disabled>Выбери</option>
                  {(brands?.data ?? []).map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>Цвет</span>
                <select name="colorId" required defaultValue="" className={`w-full ${inputCls}`}>
                  <option value="" disabled>Выбери</option>
                  {(colors?.data ?? []).map((color) => (
                    <option key={color.id} value={color.id}>{color.colorName}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>Подкатегория</span>
                <select name="subCategoryId" required defaultValue="" className={`w-full ${inputCls}`}>
                  <option value="" disabled>Выбери</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.subCategoryName} ({sub.categoryName})</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className={labelCls}>Изображение товара</span>
              <input name="image" type="file" accept="image/*" required className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:font-medium file:text-slate-700 dark:file:bg-slate-600 dark:file:text-slate-100 file:px-3 file:py-2 file:text-sm" />
            </label>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
                Cancel
              </button>
              <button type="submit" disabled={isAdding} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {isAdding ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {toEdit ? (
        <EditProductModal
          product={toEdit}
          brands={brands?.data ?? []}
          colors={colors?.data ?? []}
          subCategories={subCategories}
          onClose={() => setToEdit(null)}
        />
      ) : null}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteProduct(toDelete.id);
            push("delete", toDelete.productName);
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}
