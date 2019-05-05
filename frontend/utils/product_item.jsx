export const fetchProductItems = () => (
  $.ajax({
    method: 'GET',
    url: 'api/product_items/'
  })
);

export const fetchProductItem = id => (
  $.ajax({
    method: 'GET',
    url: `api/product_item/${id}`

  })
);