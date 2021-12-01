import { render, screen, fireEvent } from "@testing-library/react";
import SummaryForm from "./../SummaryForm";

test("default button and checkbox", () => {
  render(<SummaryForm />);
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  expect(buttonElement).toBeDisabled();
  expect(checkboxElement).not.toBeChecked();

  fireEvent.click(checkboxElement);

  expect(buttonElement).toBeEnabled();
  expect(checkboxElement).toBeChecked();

  fireEvent.click(checkboxElement);

  expect(buttonElement).toBeDisabled();
  expect(checkboxElement).not.toBeChecked();
});
