import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  // render path
  render(<App />);
  // add ice cream scoops and toppings
  const vanilla = await screen.findByRole("spinbutton", { name: "Vanilla" });
  const cherries = await screen.findByRole("checkbox", { name: "Cherries" });
  const hotFudge = screen.getByRole("checkbox", { name: "Hot fudge" });
  userEvent.clear(vanilla);
  userEvent.type(vanilla, "2");
  userEvent.click(cherries);
  userEvent.click(hotFudge);

  // find and click order button
  const orderButton = screen.getByRole("button", { name: "Order Sundae!" });
  userEvent.click(orderButton);

  // check summary info based on order
  const orderSummary = screen.getByRole("heading", { name: /order summary/i });
  expect(orderSummary).toBeInTheDocument();
  const scoopTotals = screen.getByText("Scoops: $", { exact: false });
  const toppingTotals = screen.getByText("Toppings: $", { exact: false });
  expect(scoopTotals).toHaveTextContent("4.00");
  expect(toppingTotals).toHaveTextContent("3.00");
  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((e) => e.textContent);
  expect(optionItemsText).toEqual(["2 Vanilla", "Cherries", "Hot fudge"]);

  // accept terms and conditions and click button to confirm order
  const acceptCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const acceptButton = screen.getByRole("button", { name: /confirm order/i });
  userEvent.click(acceptCheckbox);
  userEvent.click(acceptButton);

  // confirm order number on confirmation page
  const orderConfirmation = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(orderConfirmation).toBeInTheDocument();
  const orderNumber = screen.getByText("Your order number is", {
    exact: false,
  });
  expect(orderNumber).toHaveTextContent("12345");

  // click "new order" button on confirmation page
  const newOrder = screen.getByRole("button", {
    name: /create new order/i,
  });
  userEvent.click(newOrder);

  // check that scoops and toppings subtotals have been reset
  const scoopSubtotal = await screen.findByText("Scoops total: $0.00");
  const toppingSubtotal = screen.getByText("Toppings total: $0.00");
  const grandTotal = screen.getByText("Grand total: $0.00");
  expect(scoopSubtotal).toBeInTheDocument();
  expect(toppingSubtotal).toBeInTheDocument();
  expect(grandTotal).toBeInTheDocument();

  // do we need to await anything to avoid test errors?
  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});
