
json.product do
  json.partial! 'product', product: @product
  json.photoUrls @product.photos.map { |file| url_for(file) }
  json.brand @product.tags.select { |tag| tag.tag_attribute.name ==  "Brand" }[0].name
  json.category @product.tags.select { |tag| tag.tag_attribute.name ==  "Category" }.select { |cat| !cat.parent_tag_id }[0].name
  json.subCategory @product.tags.select { |tag| tag.tag_attribute.name ==  "Category" }.select { |cat| cat.parent_tag_id }[0].name
  json.color @product.tags.select { |tag| tag.tag_attribute.name ==  "Color" }[0].name
end

json.product_items do 
  @product.product_items.each do |product_item|
    json.set! product_item.id do
      json.partial! 'api/product_items/product_item', product_item: product_item
    end
  end
end

@orders = current_user.orders
json.orders do 
  @orders.each do |order|
    json.set! order.id do 
      json.extract! order, :id, :user_id, :shipping_state
    end
  end
  json.currentOrderId current_user.current_order[0].id
end

json.orderItems do 
  @orders.last.order_items.each do |order_item|
    json.set! order_item.id do 
      json.extract! order_item,  :id, :product_item_id, :order_id
    end
  end
end


