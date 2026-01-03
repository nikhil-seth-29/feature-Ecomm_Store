import React, { useState } from "react";
import { addToCart, checkout } from "./api";

function App() {
  const [discount, setDiscount] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleAdd = async () => {
    await addToCart({
      userId: "u1",
      itemId: "item1",
      price: 100,
      quantity: 1
    });
    alert("Item added");
  };

  const handleCheckout = async () => {
    const res = await checkout({
      userId: "u1",
      discountCode: discount
    });
    setResult(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ecommerce Store</h2>

      <button onClick={handleAdd}>Add Item</button>
      <br /><br />

      <input
        placeholder="Discount Code"
        value={discount}
        onChange={e => setDiscount(e.target.value)}
      />

      <button onClick={handleCheckout}>Checkout</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
