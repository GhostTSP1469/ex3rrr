import { useState } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../../shared/api/imageUrl";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetUserProfilesQuery,
} from "../../shared/api/storeApi";

// анимированный градиент (рамка + свечение)
const rainbow =
  "[background-image:linear-gradient(45deg,#fa0a0a,#eb021d,#f17917,#e763dc,#b96565,#e0d18b,#df6a0b,#956df3,#b15a65,#f5d103)] bg-[length:400%_400%] animate-[steam_40s_linear_infinite]";

function CategoryBarsCard({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative self-start">
      {/* свечение */}
      <div className={`pointer-events-none absolute -inset-1 rounded-2xl opacity-60 blur-[18px] ${rainbow}`} />
      {/* анимированная рамка */}
      <div className={`relative rounded-2xl p-0.75 ${rainbow}`}>
        <div className="rounded-[14px] bg-black p-6">
          <h2 className="text-base font-semibold text-[#fff7f7] [text-shadow:4px_4px_3px_rgba(31,53,31,1)]">
            Products by category
          </h2>
          <p className="mb-7 text-xs tracking-wide text-white/60">
            {selected !== null ? (
              <span className="text-white/90">
                {labels[selected]} — <b>{values[selected]}</b> products
              </span>
            ) : (
              <>live · {total} products total · нажми на бар</>
            )}
          </p>

          <div className="flex h-36 items-end justify-between gap-2 px-1">
            {values.map((value, index) => {
              const height = Math.max(18, Math.round((value / max) * 120));
              return (
                <button
                  type="button"
                  key={labels[index] + index}
                  onClick={() => setSelected(index === selected ? null : index)}
                  style={{ height: `${height}px`, animationDelay: `${0.2 * (index + 1)}s` }}
                  className={`relative flex w-6 origin-bottom cursor-pointer items-end justify-center rounded-t border-0 shadow-[-5px_-5px_9px_rgba(77,45,45,0.45),5px_5px_9px_rgba(39,39,39,1)] animate-[rippleBounce_7.5s_ease-in-out_infinite] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#ff7a85d2]"
                  } ${selected === index ? "ring-2 ring-white" : ""}`}
                  title={`${labels[index]}: ${value}`}
                >
                  <span className="absolute -top-6 text-xs font-bold text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.65)]">
                    {value}
                  </span>
                  <span className="pb-1 text-[11px] font-semibold text-black/75">
                    {(labels[index] ?? "?").charAt(0).toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tint }: { label: string; value: number | string; tint: string }) {
  return (
    <div className={`rounded-xl p-5 ${tint}`}>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: products } = useGetProductsQuery({ PageNumber: 1, PageSize: 100 });
  const { data: users } = useGetUserProfilesQuery({ PageNumber: 1, PageSize: 1 });
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const allProducts = products?.data?.products ?? [];
  const categoryList = categories?.data ?? [];
  const topProducts = allProducts.slice(0, 6);

  // график зависит от реальных данных: сколько товаров в каждой категории
  const chartLabels = categoryList.map((category) => category.categoryName);
  const chartValues = categoryList.map(
    (category) => allProducts.filter((product) => product.categoryId === category.id).length,
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Products" value={products?.totalRecord ?? 0} tint="bg-rose-50 dark:bg-rose-500/10" />
        <StatCard label="Users" value={users?.totalRecord ?? 0} tint="bg-amber-50 dark:bg-amber-500/10" />
        <StatCard label="Categories" value={categoryList.length} tint="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard label="Brands" value={brands?.data?.length ?? 0} tint="bg-sky-50 dark:bg-sky-500/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {chartValues.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <p className="py-16 text-center text-sm text-slate-400">No data yet.</p>
          </div>
        ) : (
          <CategoryBarsCard values={chartValues} labels={chartLabels} />
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top products</h2>
            <Link to="/admin/products" className="text-sm font-medium text-blue-600 hover:underline">
              See all →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-400">No products yet.</p>
            ) : (
              topProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/admin/products"
                  className="flex items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <img src={imageUrl(product.image)} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{product.productName}</div>
                    <div className="text-xs text-slate-400">{product.categoryName || "—"}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">${product.price}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
