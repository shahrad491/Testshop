import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./api.slice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetail: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 10,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailQuery } =
  productsApiSlice;
