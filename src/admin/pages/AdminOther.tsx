import { useState, type FormEvent } from "react";
import { imageUrl } from "../../shared/api/imageUrl";
import {
  useAddBrandMutation,
  useAddCategoryMutation,
  useAddColorMutation,
  useAddSubCategoryMutation,
  useDeleteBrandMutation,
  useDeleteCategoryMutation,
  useDeleteColorMutation,
  useDeleteSubCategoryMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetColorsQuery,
  useUpdateBrandMutation,
  useUpdateCategoryMutation,
  useUpdateColorMutation,
  useUpdateSubCategoryMutation,
} from "../../shared/api/storeApi";
import { PencilIconSm, TrashIconSm } from "../AdminIcons";

type Tab = "categories" | "subcategories" | "colors" | "brands";

const tabs: { key: Tab; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Subcategories" },
  { key: "colors", label: "Colors" },
  { key: "brands", label: "Brands" },
];

export default function AdminOther() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.key
                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "categories" ? <CategoriesTab /> : null}
      {tab === "subcategories" ? <SubcategoriesTab /> : null}
      {tab === "colors" ? <ColorsTab /> : null}
      {tab === "brands" ? <BrandsTab /> : null}
    </div>
  );
}

function CategoriesTab() {
  const { data } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isSaving }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // null = режим добавления, число = редактируем категорию с этим id
  const [editId, setEditId] = useState<number | null>(null);

  function startEdit(id: number, categoryName: string) {
    setEditId(id);
    setName(categoryName);
    setFile(null);
  }

  function resetForm() {
    setEditId(null);
    setName("");
    setFile(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !file) return;
    const body = new FormData();
    body.append("CategoryName", name.trim());
    body.append("CategoryImage", file);
    if (editId !== null) {
      body.append("Id", String(editId));
      await updateCategory(body).unwrap().catch(() => undefined);
    } else {
      await addCategory(body).unwrap().catch(() => undefined);
    }
    resetForm();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(data?.data ?? []).map((category) => (
          <div
            key={category.id}
            className={`relative rounded-xl border bg-white dark:bg-slate-800 p-5 text-center ${
              editId === category.id ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(category.id, category.categoryName)}
                className="text-slate-300 hover:text-blue-500"
                aria-label="Edit"
              >
                <PencilIconSm />
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="text-slate-300 hover:text-red-500"
                aria-label="Delete"
              >
                <TrashIconSm />
              </button>
            </div>
            <img src={imageUrl(category.categoryImage)} alt="" className="mx-auto mb-3 h-12 w-12 object-contain" />
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{category.categoryName}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="h-max rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
          {editId !== null ? "Edit category" : "Add new category"}
        </h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          {editId !== null
            ? "Измени название и загрузи изображение заново (API требует картинку при сохранении)."
            : "Название категории + иконка (png/svg). Категория появится в каталоге и в меню."}
        </p>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Название категории</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="например Electronics"
          className="mb-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Иконка категории</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mb-4 w-full text-sm text-slate-500 dark:text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:font-medium file:text-slate-700 dark:file:bg-slate-600 dark:file:text-slate-100 file:px-3 file:py-2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isAdding || isSaving || !name.trim() || !file}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {editId !== null ? (isSaving ? "Saving..." : "Save") : isAdding ? "Creating..." : "Create"}
          </button>
          {editId !== null ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

const subInputCls =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

function SubcategoriesTab() {
  const { data } = useGetCategoriesQuery();
  const [addSubCategory, { isLoading }] = useAddSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const categories = data?.data ?? [];
  // плоский список подкатегорий с привязкой к родительской категории
  const rows = categories.flatMap((category) =>
    category.subCategories.map((sub) => ({
      id: sub.id,
      name: sub.subCategoryName,
      categoryId: category.id,
      categoryName: category.categoryName,
    })),
  );

  // форма добавления
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  // инлайн-редактирование
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(0);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !categoryId) return;
    await addSubCategory({ CategoryId: categoryId, SubCategoryName: name.trim() })
      .unwrap()
      .catch(() => undefined);
    setName("");
  }

  function startEdit(row: (typeof rows)[number]) {
    setEditId(row.id);
    setEditName(row.name);
    setEditCategoryId(row.categoryId);
  }

  async function saveEdit() {
    if (editId === null || !editName.trim() || !editCategoryId) return;
    await updateSubCategory({
      Id: editId,
      CategoryId: editCategoryId,
      SubCategoryName: editName.trim(),
    })
      .unwrap()
      .catch(() => undefined);
    setEditId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Subcategory</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                  No subcategories yet.
                </td>
              </tr>
            ) : (
              rows.map((row) =>
                editId === row.id ? (
                  <tr key={row.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0">
                    <td className="px-5 py-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className={subInputCls}
                      />
                    </td>
                    <td className="px-5 py-2">
                      <select
                        value={editCategoryId}
                        onChange={(event) => setEditCategoryId(Number(event.target.value))}
                        className={subInputCls}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditId(null)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">{row.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{row.categoryName}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded-lg border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/15"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubCategory(row.id)}
                          className="text-slate-300 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <TrashIconSm />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="h-max rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Add subcategory</h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Выбери родительскую категорию и введи название подкатегории (например Laptops в Computers).
        </p>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Родительская категория</label>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(Number(event.target.value))}
          className={`mb-3 ${subInputCls}`}
        >
          <option value={0} disabled>
            Choose category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Название подкатегории</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="например Laptops"
          className={`mb-4 ${subInputCls}`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

function ColorsTab() {
  const { data } = useGetColorsQuery();
  const [addColor, { isLoading }] = useAddColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    await addColor(name.trim()).unwrap().catch(() => undefined);
    setName("");
  }

  async function saveEdit() {
    if (editId === null || !editName.trim()) return;
    await updateColor({ Id: editId, ColorName: editName.trim() }).unwrap().catch(() => undefined);
    setEditId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Colors</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((color) =>
              editId === color.id ? (
                <tr key={color.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0">
                  <td className="px-5 py-2">
                    <input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      className={subInputCls}
                      autoFocus
                    />
                  </td>
                  <td className="px-5 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={saveEdit} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditId(null)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={color.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{color.colorName}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(color.id);
                          setEditName(color.colorName);
                        }}
                        className="rounded-lg border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/15"
                      >
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteColor(color.id)} className="text-slate-300 hover:text-red-500" aria-label="Delete">
                        <TrashIconSm />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="h-max rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Add new color</h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Название цвета (Black, Silver, Blue). Используется при создании товара.
        </p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="например Black"
          className="mb-4 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

function BrandsTab() {
  const { data } = useGetBrandsQuery();
  const [addBrand, { isLoading }] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    await addBrand(name.trim()).unwrap().catch(() => undefined);
    setName("");
  }

  async function saveEdit() {
    if (editId === null || !editName.trim()) return;
    await updateBrand({ Id: editId, BrandName: editName.trim() }).unwrap().catch(() => undefined);
    setEditId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Brands</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-slate-400">
                  No brands yet.
                </td>
              </tr>
            ) : (
              (data?.data ?? []).map((brand) =>
                editId === brand.id ? (
                  <tr key={brand.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0">
                    <td className="px-5 py-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className={subInputCls}
                        autoFocus
                      />
                    </td>
                    <td className="px-5 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={saveEdit} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditId(null)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={brand.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">{brand.brandName}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(brand.id);
                            setEditName(brand.brandName);
                          }}
                          className="rounded-lg border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/15"
                        >
                          Edit
                        </button>
                        <button type="button" onClick={() => deleteBrand(brand.id)} className="text-slate-300 hover:text-red-500" aria-label="Delete">
                          <TrashIconSm />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="h-max rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Add new brand</h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Название бренда (например ASUS, Apple). Потом его можно выбрать у товара.
        </p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Brand name"
          className={subInputCls}
        />
        <button type="submit" disabled={isLoading} className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
