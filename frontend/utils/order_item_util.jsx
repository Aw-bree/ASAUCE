export const createOrderItem = (user, orderItem) => {
  return $.ajax({
    method: "POST",
    url: `api/orders/${orderItem.order_id}/order_items`,
    data: {orderItem}
  })
}

export const updateOrderItem = (user, orderItems) => (
  $.ajax({
    method: "PATCH",
    url: `/api/users/${user.id}/orders/${user.current_order.id}/order_items/${orderItems.id}`,
    data: { orderItems }
  })
)

export const fetchOrderItems = (user, order) => (
  $.ajax({
    method: "GET",
    url: `/api/users/${user.id}/orders/${order.id}/order_items`,
  })
)

export const fetchOrderItem = (user, order, item) => (
  $.ajax({
    method: "GET",
    url: `api/users/${user.id}/orders/${order.id}/order_items/${item.id}`,
  })
)

export const deleteOrderItem = (id, user, order_id) => (
  $.ajax({
    method: "DELETE",
    url: `api/orders/${order_id}/order_items/${id}`,
    orderItem: {
      order_id: order_id,
      id: id
    }
  })
)