import request from "supertest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { baseUrl, baseUrlOneProductById } from "../../../features/url/url";
import { BrowserRouter } from "react-router-dom";
import { Products } from "../products";
import { Provider } from "react-redux";
import store from "../../../features/store/store";

describe("testing restApi", () => {
  it("baseUrl should return a 200 status code", async () => {
    const response = await request(baseUrl).get("");
    expect(response.statusCode).toBe(200);
  });

  it("baseUrlOneProductById should return a 200 status code", async () => {
    const response = await request(baseUrlOneProductById).get("1");
    expect(response.statusCode).toBe(200);
  });

  it("baseUrl should return a 5 length product", async () => {
    const response = await request(baseUrl).get("?per_page=5");
    expect(response.body.data).toHaveLength(5);
  });

  it("baseUrl should return a correct object with value", async () => {
    const response = await request(baseUrlOneProductById).get("1");
    expect(response.body.data).toStrictEqual({
      id: 1,
      name: "cerulean",
      year: 2000,
      color: "#98B2D1",
      pantone_value: "15-4020",
    });
  });

  it("baseUrl should return a correct array", async () => {
    const response = await request(baseUrl).get("?per_page=5");
    expect(response.body.data).toStrictEqual([
      {
        color: "#98B2D1",
        id: 1,
        name: "cerulean",
        pantone_value: "15-4020",
        year: 2000,
      },
      {
        color: "#C74375",
        id: 2,
        name: "fuchsia rose",
        pantone_value: "17-2031",
        year: 2001,
      },
      {
        color: "#BF1932",
        id: 3,
        name: "true red",
        pantone_value: "19-1664",
        year: 2002,
      },
      {
        color: "#7BC4C4",
        id: 4,
        name: "aqua sky",
        pantone_value: "14-4811",
        year: 2003,
      },
      {
        color: "#E2583E",
        id: 5,
        name: "tigerlily",
        pantone_value: "17-1456",
        year: 2004,
      },
    ]);
  });

  it("baseURl should return a value total:12", async () => {
    const response = await request(baseUrl).get("");
    expect(response.body.total).toBe(12);
  });

  it("baseUrl should return a value total_pages:3", async () => {
    const response = await request(baseUrl).get("?per_page=5");
    expect(response.body.total_pages).toBe(3);
  });

  it("baseUrl with click next page should a return page 2", async () => {
    const response = await request(baseUrl).get("?per_page=5&page=2");
    expect(response.body.page).toBe(2);
  });

  it("baseUrl with one click next page, data should a return object in array", async () => {
    const response = await request(baseUrl).get("?per_page=5&page=2");
    expect(response.body.data).toStrictEqual([
      {
        id: 6,
        name: "blue turquoise",
        year: 2005,
        color: "#53B0AE",
        pantone_value: "15-5217",
      },
      {
        id: 7,
        name: "sand dollar",
        year: 2006,
        color: "#DECDBE",
        pantone_value: "13-1106",
      },
      {
        id: 8,
        name: "chili pepper",
        year: 2007,
        color: "#9B1B30",
        pantone_value: "19-1557",
      },
      {
        id: 9,
        name: "blue iris",
        year: 2008,
        color: "#5A5B9F",
        pantone_value: "18-3943",
      },
      {
        id: 10,
        name: "mimosa",
        year: 2009,
        color: "#F0C05A",
        pantone_value: "14-0848",
      },
    ]);
  });
});

describe("testing component Products", () => {
  it("it's renders", () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Products />
        </Provider>
      </BrowserRouter>
    );
  });

  it("button have correct value: prev page", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Products />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => screen.findByTestId("moviePrev"));
    const button = screen.getByTestId("moviePrev");
    expect(button.textContent).toBe("prev page");
  });

  it("button have correct value: next page", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Products />
        </Provider>
      </BrowserRouter>
    );
    await waitFor(() => screen.findByTestId("movieNext"));
    const button = screen.getByTestId("movieNext");
    expect(button.textContent).toBe("next page");
  });

  it("input have correct empty value : ``", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Products />
        </Provider>
      </BrowserRouter>
    );
    await waitFor(() => screen.findByTestId("formInputSearchPhrase"));
    const input = screen.getByTestId("formInputSearchPhrase");
    expect(input.textContent).toBe("");
  });

  it("show error phrase: `Product not found`` if input have incorrect phrase", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Products />
        </Provider>
      </BrowserRouter>
    );
    const user = userEvent.setup();
    await waitFor(() => screen.findByTestId("formInputSearchPhrase"));
    const input = screen.getByTestId("formInputSearchPhrase");
    await user.type(input, "13");
    await waitFor(() => screen.findByTestId("errorPhrase"));
    const error = screen.getByTestId("errorPhrase");
    expect(error.textContent).toBe("Product not found");
  });
});
