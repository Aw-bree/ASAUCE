@products.each do |product|
  json.set! product.id do
    json.partial! 'product', product: product
    json.photoUrls product.photos.map { |file| url_for(file) }
    json.brand product.tags.select { |tag| tag.tag_attribute.name ==  "Brand" }[0].name
    json.category product.tags.select { |tag| tag.tag_attribute.name ==  "Category" }.select { |cat| cat.parent_tag_id }[0].name
    json.subCategory product.tags.select { |tag| tag.tag_attribute.name ==  "Category" }.select { |cat| !cat.parent_tag_id }[0].name
    json.color product.tags.select { |tag| tag.tag_attribute.name ==  "Color" }[0].name
  end
end