import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoopsto 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when toppings change", async () => {
  render(<Options optionType="toppings" />);

  // make sure total starts out $0.00
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  //"Cherries", "M&Ms","Hot fudge"

  // update cherries toppings to 1 and check the subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // update M&Ms and Hot fudge and check subtotal
  const mmCheckbox = await screen.findByRole("checkbox", {
    name: "M&Ms",
  });
  const hotFudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  userEvent.click(mmCheckbox);
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("4.50");

  userEvent.click(mmCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");
});

describe("grand total", () => {
  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByText("Grand total: $", { exact: false });
    const vanillaScoop = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const MMsTopping = await screen.findByRole("checkbox", { name: "M&Ms" });

    expect(grandTotal).toHaveTextContent("0.00");

    userEvent.clear(vanillaScoop);
    userEvent.type(vanillaScoop, "1");
    expect(grandTotal).toHaveTextContent("2.00");

    userEvent.click(MMsTopping);
    expect(grandTotal).toHaveTextContent("3.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByText("Grand total: $", { exact: false });
    const chocolateScoop = await screen.findByRole("spinbutton", {
      name: "Chocolate",
    });
    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    userEvent.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("1.50");

    userEvent.clear(chocolateScoop);
    userEvent.type(chocolateScoop, "2");
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByText("Grand total: $", { exact: false });
    const vanillaScoop = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const MMsTopping = await screen.findByRole("checkbox", { name: "M&Ms" });
    const hotFudgeTopping = await screen.findByRole("checkbox", {
      name: "Hot fudge",
    });

    userEvent.clear(vanillaScoop);
    userEvent.type(vanillaScoop, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    userEvent.click(MMsTopping);
    userEvent.click(hotFudgeTopping);
    expect(grandTotal).toHaveTextContent("7.00");

    userEvent.click(hotFudgeTopping);
    expect(grandTotal).toHaveTextContent("5.50");

    userEvent.type(vanillaScoop, "1");
    expect(grandTotal).toHaveTextContent("3.50");

    userEvent.type(vanillaScoop, "0");
    expect(grandTotal).toHaveTextContent("1.50");
  });
});
