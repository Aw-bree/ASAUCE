
json.product do
  json.partial! 'product', product: @product
  json.photoUrls @product.photos.map { |file| url_for(file) }
end

json.product_items do 
  @product_items.each do |product_item|
    json.set! product_item.id do
      json.partial! 'api/product_items/product_item', product_item: product_item
    end
  end
end

json.orders do
  json.id @orders.ids[0]
end

json.order_items do 
  @order_items.each do |order_item|
    json.set! order_item.id do 
      json.extract! order_item, :id, :order_id, :product_item_id
    end
  end
end




