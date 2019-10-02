export const selectSizeAvailability = ({ entities }) => {
  let items = Object.values(entities["productItems"]);
  let sizeAvailability = {};

  sizeAvailability["Select a size"] = 0;

  for (let i = 0; i < items.length; i++) {
    let sz = items[`${i}`].size;
    if (sizeAvailability[`${i}`] === undefined) {
      sizeAvailability[`${sz}`] = 0;
    }
    
    if (items[`${i}`].state === "Available") {
      sizeAvailability[`${sz}`] += 1;
    }
  }

  return sizeAvailability;
}

export const selectSubTotal = ({ entities }) => {
 
  let items = Object.values(entities["orderItems"]);
  let subTotal = 0;

  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      let price = parseInt(items[`${i}`].unitPrice)
      subTotal += price;
    }
  }

  return subTotal;
}

export const selectOrderProductItemId = (product_items, size) => {
  let items = Object.values(product_items);

  let filtered = items.filter(function (x) {
    return x.size === size && x.state === "Available";
  });

  if (filtered.length > 0) {
    return parseInt(filtered[0].id)
  } else {
    return undefined
  }
}

export const selectOrderItemListings = (orderItems, products, productItems) => {
  let array = Object.entries(orderItems)
  let result = [];
  if (array.length > 0) {
    result = array.map((orderItem) => {
      return {
        id: orderItem[1].id,
        price: orderItem[1].unitPrice,
        brand: "some",
        color: "some",
        size: productItems[orderItem[1].product_item_id].size,
        shortTitle: products[productItems[orderItem[1].product_item_id].product_id].title,
        photosUrl: products[productItems[orderItem[1].product_item_id].product_id].photoUrls[0]
      }
    })
  }

  return result;
}

