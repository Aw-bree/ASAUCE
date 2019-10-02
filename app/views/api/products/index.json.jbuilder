if @products.is_a?(ActiveRecord::Base)
  @products = [@products]
else
  @products
end

@products.each do |product|
  json.set! product.id do
    json.partial! 'product', product: product
    json.photoUrls product.photos.map { |file| url_for(file) }
    json.category product.tags.select { |tag| tag.tag_attribute.name ==  "Category" }.select { |cat| !cat.parent_tag_id }[0].name
  end
end