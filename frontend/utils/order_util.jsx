export const createOrder = user => (
  $.ajax({
    method: 'POST',
    url: `api/users/${user.id}/orders`
  })
)

export const fetchOrder = (id) => (
  $.ajax({
    method: 'GET',
    url: `api/orders/${id}`
  })
)

export const fetchCurrentOrderId = user => (
  $.ajax({
    method: `GET`,
    url: `api/users/${id}`
  })
)