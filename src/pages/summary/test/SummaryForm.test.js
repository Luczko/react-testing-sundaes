import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SummaryForm from "./../SummaryForm";
import userEvent from "@testing-library/user-event";

test("default button and checkbox", () => {
  render(<SummaryForm />);
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  expect(buttonElement).toBeDisabled();
  expect(checkboxElement).not.toBeChecked();

  userEvent.click(checkboxElement);

  expect(buttonElement).toBeEnabled();
  expect(checkboxElement).toBeChecked();

  userEvent.click(checkboxElement);

  expect(buttonElement).toBeDisabled();
  expect(checkboxElement).not.toBeChecked();
});

test("popover response to hover", async () => {
  render(<SummaryForm />);

  //popover stars out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  //popover appears on mouseover
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  userEvent.hover(termsAndConditions);

  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  //popover disapears when mouse out
  userEvent.unhover(termsAndConditions);
  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered/i)
  );
  //expect(nullPopoverAgain).not.toBeInTheDocument();
});
