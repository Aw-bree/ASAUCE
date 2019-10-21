json.attributes do
  @attributes.each do |attr|
    json.set! attr.id do
      json.id attr.id
      json.name attr.name
      json.filters attr.tags.each do |filter|
        json.id filter.id
        json.name filter.name
        json.count filter.products.count
        json.parentId filter.parent_tag_id
      end
    end
  end
end
