import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, baseUrlOneProductById } from "../url/url";
const initialState = {
  products: [],
  loading: true,
  failed: false,
  success: false,
};

const checkForError = (response) => {
  if (!response.ok) throw Error("ERROR" + response.statusText);
  return response.json();
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (page = 1) => {
    return await fetch(`${baseUrl}?per_page=5&page=${page}`)
      .then(checkForError)
      .then((data) => data)
      .catch((error) => console.error("FETCH_ERROR: ", error));
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (numberId) => {
    return await fetch(`${baseUrlOneProductById}${numberId}`)
      .then(checkForError)
      .then((data) => data)
      .catch((error) => console.error("FETCH ERROR: ", error));
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.failed = false;
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.failed = false;
      state.success = true;
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.failed = true;
    });
    builder.addCase(getProduct.pending, (state) => {
      state.failed = false;
      state.loading = true;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.failed = false;
      state.success = true;
      if (action.payload) {
        state.products = action.payload;
      }
    });
    builder.addCase(getProduct.rejected, (state) => {
      state.failed = true;
    });
  },
});
