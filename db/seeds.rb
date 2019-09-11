# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'open-uri'
require 'json'

Product.delete_all

open("https://raw.githubusercontent.com/Aw-bree/seedHelper/master/asauce_create_products.json") do |products|
  data = []

  products.read.each_line do |product|
    @item = JSON.parse(product, :quirks_mode => true)
    object = {
      "product_code": @item["product_code"],
      "title": @item["title"],
      "model_size": @item["model_size"],
      "model_height": @item["model_height"],
      "fabric_stretch": @item["fabric_stretch"],
      "fabric_material":  @item["fabric_material"],
      "main_fiber_content":   @item["main_fiber_content"],
      "care_advice": @item["care_advice"],
      "care_instructions":  @item["care_instructions"],
      "price":  @item["price"],
      "markdown": @item["markdown"],
      "description": @item["description"]
    }
    data << object
  end
  Product.create!(data)
end

open("https://raw.githubusercontent.com/Aw-bree/seedHelper/master/asauce_upload_images.json") do |productfiles|
  data = []

  productfiles.read.each_line do |product|
    @item = JSON.parse(product, :quirks_mode => true)
    object = {
      "product_code": @item["product_code"],
      "img_path_1": @item["img_path_1"],
      "img_path_2": @item["img_path_2"],
      "img_path_3": @item["img_path_3"],
      "img_path_4": @item["img_path_4"]
    }
    data << object
  end


  data.each do |prods|
    code = prods[:product_code]
    @product = Product.find_by(product_code: code)

    file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_1]}")
    @product.photos.attach(io: file, filename: prods[:img_path_1])

    file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_2]}")
    @product.photos.attach(io: file, filename: prods[:img_path_2])

    file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_3]}")
    @product.photos.attach(io: file, filename: prods[:img_path_3])

    file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_4]}")
    @product.photos.attach(io: file, filename: prods[:img_path_4])
  end
end
