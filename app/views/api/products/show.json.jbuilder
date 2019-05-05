json.extract! @product, :id, :title, :description, :price

json.photoUrls @produt.photos.map { |file| url_for(file) }

json.product_items do 
  @product_items.each do |product_item|
    json.set! product_item.id do
      json.partial! 'api/product_items/product_item', product_item: product_item
    end
  end
end