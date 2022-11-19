import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { Cart, CartItem } from "~/models/CartItem";

export function useCart() {
  return useQuery<Cart, AxiosError>("cart", async () => {
    const res = await axios.get<{ body: { cart: Cart } }>(
      `${API_PATHS.bff}/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );

    return res.data.body.cart;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) => {
    const sendValue = {
      productId: values.product.id,
      count: values.count,
    };

    return axios.put<CartItem[]>(`${API_PATHS.bff}/cart`, sendValue, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });
  });
}
