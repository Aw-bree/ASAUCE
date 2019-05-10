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

export const updateProductItem = product_item => {

  return $.ajax({
    method: 'PATCH',
    url: `api/product_items/${product_item.id}`,
    data: { product_item }
  })
}