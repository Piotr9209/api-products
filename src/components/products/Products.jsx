import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProducts,
  getProduct,
} from "../../features/productsSlice/productSlice";
import { useSearchParams } from "react-router-dom";

import "./products.scss";
export const Products = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [hasErrorPhrase, setHasErrorPhrase] = useState(false);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const success = useSelector((state) => state.products.success);
  const actuallyPage = useSelector((state) => state.products.products.page);
  const totalPages = useSelector(
    (state) => state.products.products.total_pages
  );
  const total = useSelector((state) => state.products.products.total);
  const defaultObjectToValidation = {};

  const page = useMemo(() => {
    return parseInt(searchParams.get(`page`) || "1", 10);
  }, [searchParams]);

  const searchParamId = useMemo(() => {
    return (searchParams.get(`id`) || "").replace(/[^0-9]/, "");
  }, [searchParams]);

  useEffect(() => {
    if (searchParamId) {
      dispatch(getProduct(searchParamId));
      setSearchPhrase(searchParamId);
    } else {
      dispatch(getProducts(page));
    }
  }, [dispatch, page, searchParamId]);

  const movePage = (move) => {
    let newPage = page + move;
    searchParams.set(`page`, newPage.toString());
    setSearchParams(searchParams);
    setSearchPhrase("");
    setHasErrorPhrase((prevState) => false);
  };

  const handleChangeInput = (e) => {
    const regExp = new RegExp(/[^0-9]/g);
    const phraseToValidation = +e.target.value.replace(regExp, "");
    setSearchPhrase((prevState) => e.target.value.replace(regExp, ""));
    setHasErrorPhrase((prevState) => false);
    if (phraseToValidation > total || phraseToValidation === 0) {
      setHasErrorPhrase((prevState) => true);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (hasErrorPhrase || searchPhrase === "") {
      return;
    } else {
      searchParams.delete("page");
      searchParams.set(`id`, searchPhrase);
      setSearchParams(searchParams);
      setSearchPhrase("");
    }
  };
  const clearId = () => {
    searchParams.delete("id");
    searchParams.set(`page`, `1`);
    setSearchParams(searchParams);
    setSearchPhrase("");
  };

  return (
    <main>
      <div className="container">
        <form className="container__form" onSubmit={handleSubmitForm}>
          <label htmlFor="id">
            Id{" "}
            <input
              data-testid="formInputSearchPhrase"
              id="id"
              className="container__form__input--number"
              type="text"
              value={searchPhrase}
              placeholder="Please, write id"
              onChange={handleChangeInput}
            />
          </label>
          <input
            className="container__form__input--submit"
            type="submit"
            value="send"
          />
        </form>
        {hasErrorPhrase && (
          <p data-testid="errorPhrase" className="container__error">
            Product not found
          </p>
        )}
        <div>
          {success && Array.isArray(products.data) ? (
            <>
              <table className="products">
                <tbody>
                  <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>year</th>
                  </tr>
                  {products.data.map((product) => (
                    <tr key={product.id} style={{ color: product.color }}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="container__button--movePage">
                <button
                  data-testid="moviePrev"
                  onClick={() => movePage(-1)}
                  disabled={actuallyPage === 1}
                >
                  prev page
                </button>
                <button
                  data-testid="movieNext"
                  onClick={() => movePage(1)}
                  disabled={totalPages === actuallyPage}
                >
                  next page
                </button>
              </div>
            </>
          ) : (
            <div>
              {!(
                Object.getOwnPropertyNames(
                  Object.assign(defaultObjectToValidation, products.data)
                ).length === 0
              ) && (
                <div>
                  <table className="products">
                    <tbody>
                      <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>year</th>
                      </tr>
                      <tr style={{ color: products.data.color }}>
                        <td>{products.data.id}</td>
                        <td>{products.data.name}</td>
                        <td>{products.data.year}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container__button--clearId">
                    <button className="button--clearId" onClick={clearId}>
                      clear id
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
