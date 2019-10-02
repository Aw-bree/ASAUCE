if @products_items.is_a?(ActiveRecord::Base)
  @products_items = [@products_items]
else
  @products_items
end

@products_items.each do |product_item|
  json.set! product_item.id do
    json.partial! 'product_item', product_item: product_item
  end
end