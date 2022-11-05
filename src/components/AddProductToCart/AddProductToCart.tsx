import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";

type AddProductToCartProps = {
  product: Product;
  count: number;
};

export default function AddProductToCart({
  product,
  count,
}: AddProductToCartProps) {
  const { data = { items: [] }, isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const cartItem =
    data.items && data.items.length
      ? data.items.find((i) => i.product.id === product.id)
      : undefined;

  const addProduct = () => {
    const cartItemCount = cartItem ? cartItem.count + 1 : 1;
    if (count < cartItemCount) return;
    upsertCart(
      { product, count: cartItemCount },
      { onSuccess: invalidateCart }
    );
  };

  const removeProduct = () => {
    if (cartItem && cartItem.count) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: invalidateCart }
      );
    }
  };

  return cartItem ? (
    <>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
