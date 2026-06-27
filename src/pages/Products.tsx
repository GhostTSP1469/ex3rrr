import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { useT } from "../features/i18n/useT";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetColorsQuery,
  useGetProductsQuery,
  type ProductsFilter,
} from "../shared/api/storeApi";

type SortMode = "popular" | "priceAsc" | "priceDesc";

const PAGE_SIZE = 9;

// номера страниц с многоточием: 1 … 4 5 6 … 20
function getPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export default function Products() {
  const t = useT();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [categoryId, setCategoryId] = useState<number | undefined>(
    categoryFromUrl ? Number(categoryFromUrl) : undefined,
  );
  const [brandId, setBrandId] = useState<number | undefined>();
  const [colorId, setColorId] = useState<number | undefined>();
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortMode>("popular");

  // при смене любого фильтра возвращаемся на первую страницу
  useEffect(() => {
    setPage(1);
  }, [categoryId, brandId, colorId, price.min, price.max]);

  const filter: ProductsFilter = {
    CategoryId: categoryId,
    BrandId: brandId,
    ColorId: colorId,
    MinPrice: price.min,
    MaxPrice: price.max,
    PageNumber: page,
    PageSize: PAGE_SIZE,
  };

  const { data, isFetching } = useGetProductsQuery(filter);
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: brandsResponse } = useGetBrandsQuery();
  const { data: colorsResponse } = useGetColorsQuery();

  // 204 при пустом результате -> data === null, поэтому везде optional chaining
  const products = data?.data?.products ?? [];
  const totalRecord = data?.totalRecord ?? 0;
  const totalPage = data?.totalPage ?? 1;
  const categoryList = categoriesResponse?.data ?? [];
  const brands = brandsResponse?.data ?? [];
  const colors = colorsResponse?.data ?? [];

  // реальная цена с учётом скидки — по ней и сортируем
  const effectivePrice = (p: (typeof products)[number]) =>
    p.hasDiscount ? p.discountPrice : p.price;

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "priceAsc") return effectivePrice(a) - effectivePrice(b);
    if (sort === "priceDesc") return effectivePrice(b) - effectivePrice(a);
    return 0;
  });

  function toNumber(value: string): number | undefined {
    const digits = value.replace(/[^\d]/g, "");
    return digits ? Number(digits) : undefined;
  }

  function applyPrice() {
    setPrice({ min: toNumber(minInput), max: toNumber(maxInput) });
  }

  function resetFilters() {
    setCategoryId(undefined);
    setBrandId(undefined);
    setColorId(undefined);
    setMinInput("");
    setMaxInput("");
    setPrice({});
  }

  return (
    <>
      <Header />

      <main className="container page-space">
        <div className="list-top">
          <Breadcrumb items={["Explore Our Products"]} />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
          >
            <option value="popular">Popular</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
          </select>
        </div>

        <div className="products-layout">
          <aside className="filter-panel">
            <section className="filter-group">
              <h3>{t("filter.category")}</h3>
              <button
                className={categoryId === undefined ? "filter-link active" : "filter-link"}
                type="button"
                onClick={() => setCategoryId(undefined)}
              >
                {t("filter.all")}
              </button>
              {categoryList.map((category) => (
                <button
                  className={categoryId === category.id ? "filter-link active" : "filter-link"}
                  type="button"
                  key={category.id}
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.categoryName}
                </button>
              ))}
            </section>

            {brands.length > 0 ? (
              <section className="filter-group">
                <h3>{t("filter.brands")}</h3>
                {brands.map((brand) => (
                  <label className="check-line" key={brand.id}>
                    <input
                      type="checkbox"
                      checked={brandId === brand.id}
                      onChange={() => setBrandId(brandId === brand.id ? undefined : brand.id)}
                    />
                    <span>{brand.brandName}</span>
                  </label>
                ))}
              </section>
            ) : null}

            {colors.length > 0 ? (
              <section className="filter-group">
                <h3>{t("filter.colors")}</h3>
                {colors.map((color) => (
                  <label className="check-line" key={color.id}>
                    <input
                      type="checkbox"
                      checked={colorId === color.id}
                      onChange={() => setColorId(colorId === color.id ? undefined : color.id)}
                    />
                    <span>{color.colorName}</span>
                  </label>
                ))}
              </section>
            ) : null}

            <section className="filter-group">
              <h3>{t("filter.price")}</h3>
              <div className="price-inputs">
                <input
                  placeholder="Min"
                  inputMode="numeric"
                  value={minInput}
                  onChange={(event) => setMinInput(event.target.value)}
                />
                <input
                  placeholder="Max"
                  inputMode="numeric"
                  value={maxInput}
                  onChange={(event) => setMaxInput(event.target.value)}
                />
              </div>
              <button className="outline-red full" type="button" onClick={applyPrice}>
                {t("filter.apply")}
              </button>
            </section>
          </aside>

          <section>
            {isFetching ? (
              <div className="catalog-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="skeleton-card" key={index} />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <h2 className="text-3xl font-medium">{t("state.notFound")}</h2>
                <p className="text-(--muted)">{t("state.notFoundHint")}</p>
                <Button onClick={resetFilters}>{t("btn.reset")}</Button>
              </div>
            ) : (
              <div className="catalog-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>

        {totalPage > 1 ? (
          <div className="relative mt-16 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
              className="grid h-11 w-11 place-items-center rounded-xl border border-(--line) text-lg font-bold text-(--text) transition-all hover:border-(--red) hover:text-(--red) disabled:pointer-events-none disabled:opacity-30"
            >
              ←
            </button>

            {getPages(page, totalPage).map((p, index) =>
              p === "…" ? (
                <span key={`gap-${index}`} className="px-1 font-bold text-(--muted)">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`grid h-11 w-11 place-items-center rounded-xl border text-sm font-bold transition-all ${
                    p === page
                      ? "scale-105 border-(--red) bg-(--red) text-white shadow-[0_8px_18px_rgba(219,68,68,0.35)]"
                      : "border-(--line) text-(--text) hover:-translate-y-0.5 hover:border-(--red) hover:text-(--red)"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              disabled={page >= totalPage}
              aria-label="Next page"
              className="grid h-11 w-11 place-items-center rounded-xl border border-(--line) text-lg font-bold text-(--text) transition-all hover:border-(--red) hover:text-(--red) disabled:pointer-events-none disabled:opacity-30"
            >
              →
            </button>

            <span className="absolute right-0 hidden text-sm font-semibold text-(--muted) sm:block">
              {totalRecord} Results
            </span>
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
