@products = json.products do
    @order.products.each do |product|
      photoUrls = product.photos.map{ |picture| url_for(picture) } 
      json.set! product.id do
        json.extract! product, :id, :title, :price, :markdown
        json.photoUrls product.photos.map { |file| url_for(file) }
        json.tags do
          product.tags.each do |tag|
            json.set! tag.id, true
          end 
        end
      end
    end
  end
end

@products ||= {}

@productItems = json.productItems do
  @order.product_items.each do |productItem|
    json.set! productItem.id do
      json.extract! productItem, :id, :size, :state, :product_id
    end
  end
end

@productItems ||= {}

@orderItems = json.orderItems do 
  @order.order_items.each do |item|
    json.set! item.id do 
      json.extract! item, :id, :order_id, :product_item_id
      unitPrice = item.product.price
      totalQtyPrice = @order.order_items.count(item.id)
      json.totalQtyPrice totalQtyPrice
      json.unitPrice unitPrice
    end
  end
end

@orderItems ||= {}

#########

json.order do
  order_item_ids = @order.order_items.map { |item| item.id }
  json.set! @order.id do
    json.extract! @order, :user_id, :id
    json.orderItems { json.array! order_item_ids }
    orderTotal = 0
    @orderItems.each do |id, orderItem|
      orderTotal += (orderItem['totalQtyPrice'])
    end
    orderTotal = sprintf('%.2f', orderTotal)
    json.orderTotal orderTotal
  end
end

json.orderItems do 
  @order.order_items.each do |item|
    json.set! item.id do 
      json.extract! item, :id, :order_id, :product_item_id
      unitPrice = item.product.price
      totalQtyPrice = @order.order_items.count(item.id)
      json.totalQtyPrice totalQtyPrice
      json.unitPrice unitPrice
    end
  end
end

json.productItems do 
  @order.product_items.each do |productItem|
    json.set! productItem.id do 
      json.extract! productItem,  :id, :size, :state, :product_id
    end
  end
end

@order.products.each do |product|
  photoUrls = product.photos.map{ |picture| url_for(picture) } 
  json.set! product.id do
    json.extract! product, :id, :title, :price, :markdown
    json.photoUrls product.photos.map { |file| url_for(file) }
  end
end


