if @order_items.is_a?(ActiveRecord::Base)
  @order_items = [@order_items]
else
  @order_items
end

json.orderItems do 
  @order_items.each do |order_item|
    json.set! order_item.id do 
      json.extract! order_item,  :id, :product_item_id, :order_id
    end
  end
end