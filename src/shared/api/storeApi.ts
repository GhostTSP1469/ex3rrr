import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";


export interface ApiResponse<T> {
  data: T;
  errors: string[];
  statusCode: number;
}

export interface Product {
  id: number;
  productName: string;
  image: string | null;
  color: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  quantity: number;
  productInMyCart: boolean;
  categoryId: number;
  categoryName: string | null;
}

export interface Brand {
  id: number;
  brandName: string;
}

export interface Color {
  id: number;
  colorName: string;
}

export interface ProductsData {
  products: Product[];
  colors: Color[];
  brands: Brand[];
  minMaxPrice: { minPrice: number; maxPrice: number };
}


export interface ProductsResponse {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: ProductsData;
  errors: string[];
  statusCode: number;
}

export interface ProductDetail {
  id: number;
  brand: string;
  color: string;
  productInMyCart: boolean;
  images: { id: number; images: string }[];
  productName: string;
  description: string;
  quantity: number;
  weight: string | null;
  size: string | null;
  code: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  subCategoryId: number;
}

export interface Category {
  id: number;
  categoryImage: string;
  categoryName: string;
  subCategories: { id: number; subCategoryName: string }[];
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  productsInCart: CartItem[];
  totalProducts: number;
  totalPrice: number;
  totalDiscountPrice: number;
}

export interface ProductsFilter {
  ProductName?: string;
  MinPrice?: number;
  MaxPrice?: number;
  BrandId?: number;
  ColorId?: number;
  CategoryId?: number;
  SubcategoryId?: number;
  PageNumber?: number;
  PageSize?: number;
}

export interface UpdateProductParams {
  Id: number;
  BrandId: number;
  ColorId: number;
  ProductName: string;
  Description: string;
  Quantity: number;
  Code: string;
  Price: number;
  HasDiscount: boolean;
  DiscountPrice: number;
  SubCategoryId: number;
  Weight?: string;
  Size?: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserRole {
  id: string;
  name: string;
}

export interface UserProfile {
  userName: string;
  userId: string;
  image: string;
  userRoles: UserRole[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
}

export interface UsersResponse {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: UserProfile[];
  errors: string[];
  statusCode: number;
}

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Cart", "Products", "Brands", "Categories", "Colors", "Users"],
  endpoints: (builder) => ({
    
    login: builder.mutation<ApiResponse<string>, LoginRequest>({
      query: (body) => ({ url: "/Account/login", method: "POST", data: body }),
    }),
    register: builder.mutation<ApiResponse<string>, RegisterRequest>({
      query: (body) => ({ url: "/Account/register", method: "POST", data: body }),
    }),

   
    getProducts: builder.query<ProductsResponse, ProductsFilter>({
      query: (params) => ({ url: "/Product/get-products", method: "GET", params }),
      providesTags: ["Products"],
    }),
    getProductById: builder.query<ApiResponse<ProductDetail>, number>({
      query: (id) => ({ url: "/Product/get-product-by-id", method: "GET", params: { id } }),
      providesTags: ["Products"],
    }),
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({ url: "/Category/get-categories", method: "GET" }),
      providesTags: ["Categories"],
    }),
   
    getBrands: builder.query<{ data: Brand[] }, void>({
      query: () => ({ url: "/Brand/get-brands", method: "GET", params: { PageSize: 100 } }),
      providesTags: ["Brands"],
    }),
    getColors: builder.query<{ data: Color[] }, void>({
      query: () => ({ url: "/Color/get-colors", method: "GET", params: { PageSize: 100 } }),
      providesTags: ["Colors"],
    }),

    
    getCart: builder.query<ApiResponse<Cart[]>, void>({
      query: () => ({ url: "/Cart/get-products-from-cart", method: "GET" }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Cart/add-product-to-cart", method: "POST", params: { id } }),
      invalidatesTags: ["Cart"],
    }),
    increaseCart: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Cart/increase-product-in-cart", method: "PUT", params: { id } }),
      invalidatesTags: ["Cart"],
    }),
    reduceCart: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Cart/reduce-product-in-cart", method: "PUT", params: { id } }),
      invalidatesTags: ["Cart"],
    }),
    deleteFromCart: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Cart/delete-product-from-cart", method: "DELETE", params: { id } }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<ApiResponse<string>, void>({
      query: () => ({ url: "/Cart/clear-cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

  
    addProduct: builder.mutation<ApiResponse<number>, FormData>({
      query: (body) => ({ url: "/Product/add-product", method: "POST", data: body }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Product/delete-product", method: "DELETE", params: { id } }),
      invalidatesTags: ["Products"],
    }),
    // update-product принимает всё через query-параметры
    updateProduct: builder.mutation<ApiResponse<unknown>, UpdateProductParams>({
      query: (params) => ({ url: "/Product/update-product", method: "PUT", params }),
      invalidatesTags: ["Products"],
    }),

   
    addBrand: builder.mutation<ApiResponse<number>, string>({
      query: (BrandName) => ({ url: "/Brand/add-brand", method: "POST", params: { BrandName } }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation<ApiResponse<number>, { Id: number; BrandName: string }>({
      query: (params) => ({ url: "/Brand/update-brand", method: "PUT", params }),
      invalidatesTags: ["Brands"],
    }),
    deleteBrand: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Brand/delete-brand", method: "DELETE", params: { id } }),
      invalidatesTags: ["Brands"],
    }),

    // --- Админ: цвета ---
    addColor: builder.mutation<ApiResponse<number>, string>({
      query: (ColorName) => ({ url: "/Color/add-color", method: "POST", params: { ColorName } }),
      invalidatesTags: ["Colors"],
    }),
    updateColor: builder.mutation<ApiResponse<number>, { Id: number; ColorName: string }>({
      query: (params) => ({ url: "/Color/update-color", method: "PUT", params }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Color/delete-color", method: "DELETE", params: { id } }),
      invalidatesTags: ["Colors"],
    }),

    // --- Админ: категории (multipart) ---
    addCategory: builder.mutation<ApiResponse<number>, FormData>({
      query: (body) => ({ url: "/Category/add-category", method: "POST", data: body }),
      invalidatesTags: ["Categories"],
    }),
    // update-category тоже multipart: Id + CategoryName + CategoryImage (картинка обязательна)
    updateCategory: builder.mutation<ApiResponse<number>, FormData>({
      query: (body) => ({ url: "/Category/update-category", method: "PUT", data: body }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/Category/delete-category", method: "DELETE", params: { id } }),
      invalidatesTags: ["Categories"],
    }),

    // --- Админ: подкатегории (приходят вложенными в категории, поэтому инвалидируем Categories) ---
    addSubCategory: builder.mutation<ApiResponse<number>, { CategoryId: number; SubCategoryName: string }>({
      query: (params) => ({ url: "/SubCategory/add-sub-category", method: "POST", params }),
      invalidatesTags: ["Categories"],
    }),
    updateSubCategory: builder.mutation<
      ApiResponse<unknown>,
      { Id: number; CategoryId: number; SubCategoryName: string }
    >({
      query: (params) => ({ url: "/SubCategory/update-sub-category", method: "PUT", params }),
      invalidatesTags: ["Categories"],
    }),
    deleteSubCategory: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({ url: "/SubCategory/delete-sub-category", method: "DELETE", params: { id } }),
      invalidatesTags: ["Categories"],
    }),

  
    getUserProfiles: builder.query<
      UsersResponse,
      { PageNumber?: number; PageSize?: number; UserName?: string }
    >({
      query: (params) => ({ url: "/UserProfile/get-user-profiles", method: "GET", params }),
      providesTags: ["Users"],
    }),
    getUserRoles: builder.query<ApiResponse<UserRole[]>, void>({
      query: () => ({ url: "/UserProfile/get-user-roles", method: "GET" }),
    }),
    addRoleToUser: builder.mutation<ApiResponse<string>, { UserId: string; RoleId: string }>({
      query: (params) => ({ url: "/UserProfile/addrole-from-user", method: "POST", params }),
      invalidatesTags: ["Users"],
    }),
    removeRoleFromUser: builder.mutation<ApiResponse<string>, { UserId: string; RoleId: string }>({
      query: (params) => ({ url: "/UserProfile/remove-role-from-user", method: "DELETE", params }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<ApiResponse<string>, string>({
      query: (id) => ({ url: "/UserProfile/delete-user", method: "DELETE", params: { id } }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetColorsQuery,
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useIncreaseCartMutation,
  useReduceCartMutation,
  useDeleteFromCartMutation,
  useClearCartMutation,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetUserProfilesQuery,
  useGetUserRolesQuery,
  useAddRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useDeleteUserMutation,
} = storeApi;
