
unitPrice = @order_item.product.price
totalQtyPrice = (unitPrice * @order_item.order_items.length)
totalQtyPrice = sprintf('%.2f', totalQtyPrice)
unitPrice = sprintf('%.2f', unitPrice)

@order_items = @order_item.order_items
json.orderItems do
    json.extract! @order_item, :id, :product_item_id
    json.unitPrice unitPrice
    json.totalQtyPrice totalQtyPrice
end