unitPrice = @product['price']      
@order_items ||= {}       
totalQtyPrice = (unitPrice * @order_items.length)
totalQtyPrice = sprintf('%.2f', totalQtyPrice)
unitPrice = sprintf('%.2f', unitPrice)


json.orderItems do
    json.extract! @order_item, :id, :product_item_id
    json.unitPrice unitPrice
    json.totalQtyPrice totalQtyPrice
end