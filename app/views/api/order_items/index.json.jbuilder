json.orderItems do 
  @order_items.each do |order_item|
    json.set! order_item.id do 
      json.extract! order_item,  :id, :product_item_id, :order_id
    end
  end
end