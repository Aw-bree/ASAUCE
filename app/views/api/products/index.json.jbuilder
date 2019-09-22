@products.each do |product|
  json.set! product.id do
    json.partial! 'product', product: product
    json.photoUrls product.photos.map { |file| url_for(file) }
  end
end