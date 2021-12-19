import { findAllByDisplayValue } from "@testing-library/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constans";
import { useOrderDetails } from "../../contexts/OrderDetails";

export default function Options({ optionType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderDetails, updateItemCount] = useOrderDetails();

  // optionType is 'scoops' or 'toppings'
  useEffect(() => {
    axios
      .get(`http://localhost:3000/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => {
        setError(true);
      });
  }, [optionType]);
  // useEffect(() => {
  //   if (optionType === "scoops") {
  //     setItems([
  //       { name: "Chocolate", imagePath: "/images/chocolate.png" },
  //       { name: "Vanilla", imagePath: "/images/vanilla.png" },
  //     ]);
  //   }
  //   if (optionType === "toppings") {
  //     setItems([
  //       { name: "Cherries", imagePath: "/images/cherries.png" },
  //       { name: "M&Ms", imagePath: "/images/m-and-ms.png" },
  //       { name: "Hot fudge", imagePath: "/images/hot-fudge.png" },
  //     ]);
  //   }
  // }, []);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      updateItemCount={(e, f) => updateItemCount(e, f, optionType)}
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{pricePerItem[optionType]} each</p>
      <p>
        {title} total: {orderDetails.totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}
