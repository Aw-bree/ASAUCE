# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'open-uri'
require 'json'

# ActiveRecord::Base.transaction do
#   Product.delete_all

#   open("https://raw.githubusercontent.com/Aw-bree/seedHelper/master/asauce_create_products.json") do |products|
#     data = []

#     products.read.each_line do |product|
#       @item = JSON.parse(product, :quirks_mode => true)
#       object = {
#         "product_code": @item["product_code"],
#         "title": @item["title"],
#         "model_size": @item["model_size"],
#         "model_height": @item["model_height"],
#         "fabric_stretch": @item["fabric_stretch"],
#         "fabric_material":  @item["fabric_material"],
#         "main_fiber_content":   @item["main_fiber_content"],
#         "care_advice": @item["care_advice"],
#         "care_instructions":  @item["care_instructions"],
#         "price":  @item["price"],
#         "markdown": @item["markdown"],
#         "description": @item["description"]
#       }
#       data << object
#     end
#     Product.create!(data)
#   end
# end

# ActiveRecord::Base.transaction do
#   open("https://raw.githubusercontent.com/Aw-bree/seedHelper/master/asauce_upload_images.json") do |productfiles|
#     data = []

#     productfiles.read.each_line do |product|
#       @item = JSON.parse(product, :quirks_mode => true)
#       object = {
#         "product_code": @item["product_code"],
#         "img_path_1": @item["img_path_1"],
#         "img_path_2": @item["img_path_2"],
#         "img_path_3": @item["img_path_3"],
#         "img_path_4": @item["img_path_4"]
#       }
#       data << object
#     end


#     data.each do |prods|
#       code = prods[:product_code]
#       @product = Product.find_by(product_code: code)

#       file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_1]}")
#       @product.photos.attach(io: file, filename: prods[:img_path_1])

#       file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_2]}")
#       @product.photos.attach(io: file, filename: prods[:img_path_2])

#       file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_3]}")
#       @product.photos.attach(io: file, filename: prods[:img_path_3])

#       file = open("https://s3-us-west-1.amazonaws.com/asauce-seeds/asauce_photos/#{prods[:img_path_4]}")
#       @product.photos.attach(io: file, filename: prods[:img_path_4])
#     end
#   end
# end

# ActiveRecord::Base.transaction do
#   Attribute.destroy_all

#   @attr_1 = Attribute.create!(name: "Business")
#   @attr_2 = Attribute.create!(name: "Range")
#   @attr_3 = Attribute.create!(name: "Category")
#   @attr_4 = Attribute.create!(name: "Brand")
#   @attr_5 = Attribute.create!(name: "Color")
#   @attr_6 = Attribute.create!(name: "Tag")

#   Tag.destroy_all

#   @tag_1 = Tag.create!(name: "Women", attribute_id: @attr_1.id)
#   @tag_2 = Tag.create!(name: "Men", attribute_id: @attr_1.id)

#   @tag_3 = Tag.create!(name: "Petite", attribute_id: @attr_2.id)
#   @tag_4 = Tag.create!(name: "Plus", attribute_id: @attr_2.id)
#   @tag_5 = Tag.create!(name: "Main", attribute_id: @attr_2.id)
#   @tag_6 = Tag.create!(name: "Maternity", attribute_id: @attr_2.id)
#   @tag_7 = Tag.create!(name: "Tall", attribute_id: @attr_2.id)

#   @parent_tag_1 = Tag.create!(name: "Dresses", attribute_id: @attr_3.id)
#   @parent_tag_2 = Tag.create!(name: "Jeans & Trousers", attribute_id: @attr_3.id)
#   @parent_tag_3 = Tag.create!(name: "Sweaters & Cardigans", attribute_id: @attr_3.id)
#   @parent_tag_4 = Tag.create!(name: "Outerwear", attribute_id: @attr_3.id)
#   @parent_tag_5 = Tag.create!(name: "Shorts", attribute_id: @attr_3.id)
#   @parent_tag_6 = Tag.create!(name: "Skirts", attribute_id: @attr_3.id)
#   @parent_tag_7 = Tag.create!(name: "Suits & Tailoring", attribute_id: @attr_3.id)
#   @parent_tag_8 = Tag.create!(name: "Swimwear", attribute_id: @attr_3.id)
#   @parent_tag_9 = Tag.create!(name: "Tops", attribute_id: @attr_3.id)
#   @parent_tag_10 = Tag.create!(name: "Shoes", attribute_id: @attr_3.id)
#   @parent_tag_11 = Tag.create!(name: "Underwear & Sleepwear", attribute_id: @attr_3.id)

#   @sub_cat_tag_1 = Tag.create!(name: 'Cargo Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_2 = Tag.create!(name: 'Chino Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_3 = Tag.create!(name: 'Cigarette', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_4 = Tag.create!(name: 'Denim', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_5 = Tag.create!(name: 'High Waisted', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_6 = Tag.create!(name: 'Jersey Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_7 = Tag.create!(name: 'Other', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_8 = Tag.create!(name: 'Oversized', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_9 = Tag.create!(name: 'Peg Leg', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_10 = Tag.create!(name: 'Short', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_11 = Tag.create!(name: 'Skinny', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_12 = Tag.create!(name: 'Sports Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_13 = Tag.create!(name: 'Wide Leg', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_5.id)
#   @sub_cat_tag_14 = Tag.create!(name: 'A Line', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_15 = Tag.create!(name: 'Backless', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_16 = Tag.create!(name: 'Bandage', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_17 = Tag.create!(name: 'Bandeau', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_18 = Tag.create!(name: 'Bardot', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_19 = Tag.create!(name: 'Bodycon', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_20 = Tag.create!(name: 'Cable', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_21 = Tag.create!(name: 'Cold Shoulder', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_22 = Tag.create!(name: 'Denim', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_23 = Tag.create!(name: 'High Waisted', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_24 = Tag.create!(name: 'Jumper', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_25 = Tag.create!(name: 'Leather', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_26 = Tag.create!(name: 'Long Sleeve', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_27 = Tag.create!(name: 'Off Shoulder', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_28 = Tag.create!(name: 'Other', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_29 = Tag.create!(name: 'Overall Dress', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_30 = Tag.create!(name: 'Pencil Dress', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_31 = Tag.create!(name: 'Shift', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_32 = Tag.create!(name: 'Shirt', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_33 = Tag.create!(name: 'Skater', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_34 = Tag.create!(name: 'Slip', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_35 = Tag.create!(name: 'Smock Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_36 = Tag.create!(name: 'Sweater Dress', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_37 = Tag.create!(name: 'Swing', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_38 = Tag.create!(name: 'Tea', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_39 = Tag.create!(name: 'T-Shirt', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_40 = Tag.create!(name: 'Wiggle', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_41 = Tag.create!(name: 'Wrap', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_1.id)
#   @sub_cat_tag_42 = Tag.create!(name: 'A Line', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_43 = Tag.create!(name: 'Bootcut', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_44 = Tag.create!(name: 'Boyfriend', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_45 = Tag.create!(name: 'Cargo Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_46 = Tag.create!(name: 'Cargo Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_47 = Tag.create!(name: 'Chino Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_48 = Tag.create!(name: 'Cigarette', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_49 = Tag.create!(name: 'Cropped', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_50 = Tag.create!(name: 'Culottes', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_51 = Tag.create!(name: 'Denim', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_52 = Tag.create!(name: 'Denim Jacket', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_53 = Tag.create!(name: 'Flare', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_54 = Tag.create!(name: 'High Waisted', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_55 = Tag.create!(name: 'Jersey Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_56 = Tag.create!(name: 'Loose', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_57 = Tag.create!(name: 'Mom Jeans', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_58 = Tag.create!(name: 'Other', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_59 = Tag.create!(name: 'Peg Leg', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_60 = Tag.create!(name: 'Regular', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_61 = Tag.create!(name: 'Skinny', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_62 = Tag.create!(name: 'Slim', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_63 = Tag.create!(name: 'Sports Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_64 = Tag.create!(name: 'Straight Leg', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_65 = Tag.create!(name: 'Super Skinny', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_66 = Tag.create!(name: 'Tapered', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_67 = Tag.create!(name: 'Wide Leg', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_2.id)
#   @sub_cat_tag_68 = Tag.create!(name: 'A Line', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_69 = Tag.create!(name: 'Bodycon', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_70 = Tag.create!(name: 'Chino Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_71 = Tag.create!(name: 'Denim', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_72 = Tag.create!(name: 'Flare', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_73 = Tag.create!(name: 'High Waisted', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_74 = Tag.create!(name: 'Jersey Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_75 = Tag.create!(name: 'Other', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_76 = Tag.create!(name: 'Pencil Skirt', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_77 = Tag.create!(name: 'Pleated', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_78 = Tag.create!(name: 'Skater', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_79 = Tag.create!(name: 'Tulle', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_80 = Tag.create!(name: 'Wrap', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_6.id)
#   @sub_cat_tag_81 = Tag.create!(name: 'Aviator', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_82 = Tag.create!(name: 'Biker', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_83 = Tag.create!(name: 'Bomber Jacket', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_84 = Tag.create!(name: 'Coach', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_85 = Tag.create!(name: 'Denim Jacket', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_86 = Tag.create!(name: 'Duffle', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_87 = Tag.create!(name: 'Duster', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_88 = Tag.create!(name: 'Faux Fur', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_89 = Tag.create!(name: 'Leather Jacket', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_90 = Tag.create!(name: 'Military', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_91 = Tag.create!(name: 'Other', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_92 = Tag.create!(name: 'Overcoat', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_93 = Tag.create!(name: 'Oversized', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_94 = Tag.create!(name: 'Parkas', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_95 = Tag.create!(name: 'Pea Coat', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_96 = Tag.create!(name: 'Puffer', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_97 = Tag.create!(name: 'Quilted', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_98 = Tag.create!(name: 'Raincoats', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_99 = Tag.create!(name: 'Rain Jackets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_100 = Tag.create!(name: 'Regular', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_101 = Tag.create!(name: 'Skater', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_102 = Tag.create!(name: 'Swing', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_103 = Tag.create!(name: 'Track', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_104 = Tag.create!(name: 'Trench', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_105 = Tag.create!(name: 'Wax Jacket', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_106 = Tag.create!(name: 'Windbreaker', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_4.id)
#   @sub_cat_tag_107 = Tag.create!(name: 'Blouses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_108 = Tag.create!(name: 'Bralets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_109 = Tag.create!(name: 'Camis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_110 = Tag.create!(name: 'Cardigans', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_111 = Tag.create!(name: 'Collars', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_112 = Tag.create!(name: 'Corsets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_113 = Tag.create!(name: 'Crop Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_114 = Tag.create!(name: 'Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_115 = Tag.create!(name: 'Fleeces', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_116 = Tag.create!(name: 'Hoodies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_117 = Tag.create!(name: 'Kimonos', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_118 = Tag.create!(name: 'Polo Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_119 = Tag.create!(name: 'Shell Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_120 = Tag.create!(name: 'Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_121 = Tag.create!(name: 'Sweaters', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_122 = Tag.create!(name: 'Sweatshirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_123 = Tag.create!(name: 'Tanks', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_124 = Tag.create!(name: 'Tank Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_125 = Tag.create!(name: 'Teddy Lingerie', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_126 = Tag.create!(name: 'T-Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_127 = Tag.create!(name: 'Tunics', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_128 = Tag.create!(name: 'Two-Piece', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_9.id)
#   @sub_cat_tag_129 = Tag.create!(name: 'Blazers', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_130 = Tag.create!(name: 'Crop Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_131 = Tag.create!(name: 'Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_132 = Tag.create!(name: 'Jackets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_133 = Tag.create!(name: 'Kimonos', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_134 = Tag.create!(name: 'Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_135 = Tag.create!(name: 'Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_136 = Tag.create!(name: 'Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_137 = Tag.create!(name: 'Skirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_138 = Tag.create!(name: 'Suit Jackets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_139 = Tag.create!(name: 'Suit Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_140 = Tag.create!(name: 'Suit vests', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_7.id)
#   @sub_cat_tag_141 = Tag.create!(name: 'Bikini Bottoms', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_142 = Tag.create!(name: 'Bikinis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_143 = Tag.create!(name: 'Bikini Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_144 = Tag.create!(name: 'Camis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_145 = Tag.create!(name: 'Cover Ups', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_146 = Tag.create!(name: 'Crop Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_147 = Tag.create!(name: 'Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_148 = Tag.create!(name: 'Fanny Packs', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_149 = Tag.create!(name: 'Hats', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_150 = Tag.create!(name: 'Hoodies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_151 = Tag.create!(name: 'Jumpsuits', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_152 = Tag.create!(name: 'Kimonos', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_153 = Tag.create!(name: 'Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_154 = Tag.create!(name: 'Rash Tanks', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_155 = Tag.create!(name: 'Rompers', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_156 = Tag.create!(name: 'Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_157 = Tag.create!(name: 'Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_158 = Tag.create!(name: 'Skirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_159 = Tag.create!(name: 'Swimsuits', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_160 = Tag.create!(name: 'Tankinis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_161 = Tag.create!(name: 'T-Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_162 = Tag.create!(name: 'Two-Piece', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_163 = Tag.create!(name: 'Wetsuits', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_8.id)
#   @sub_cat_tag_164 = Tag.create!(name: 'Body Tapes', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_165 = Tag.create!(name: 'Bralets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_166 = Tag.create!(name: 'Bras', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_167 = Tag.create!(name: 'Bra Solutions', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_168 = Tag.create!(name: 'Briefs', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_169 = Tag.create!(name: 'Camis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_170 = Tag.create!(name: 'Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_171 = Tag.create!(name: 'Dressing Gowns', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_172 = Tag.create!(name: 'Garters', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_173 = Tag.create!(name: 'Harnesses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_174 = Tag.create!(name: 'Hoodies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_175 = Tag.create!(name: 'Jumpsuits', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_176 = Tag.create!(name: 'Kimonos', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_177 = Tag.create!(name: 'Leggings', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_178 = Tag.create!(name: 'Lingerie Bodies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_179 = Tag.create!(name: 'Lingerie Bralets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_180 = Tag.create!(name: 'Loungewear Sets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_181 = Tag.create!(name: 'Night gowns', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_182 = Tag.create!(name: 'Nipple Tassels', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_183 = Tag.create!(name: 'Onesies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_184 = Tag.create!(name: 'Pajama Bottoms', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_185 = Tag.create!(name: 'Pajamas', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_186 = Tag.create!(name: 'Pajama Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_187 = Tag.create!(name: 'Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_188 = Tag.create!(name: 'Rompers', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_189 = Tag.create!(name: 'Shapewear', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_190 = Tag.create!(name: 'Shorts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_191 = Tag.create!(name: 'Skirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_192 = Tag.create!(name: 'Sleep Masks', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_193 = Tag.create!(name: 'Sleepwear Sets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_194 = Tag.create!(name: 'Slips', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_195 = Tag.create!(name: 'Sports Bras', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_196 = Tag.create!(name: 'Suspender Belts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_197 = Tag.create!(name: 'Suspenders', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_198 = Tag.create!(name: 'Sweatpants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_199 = Tag.create!(name: 'Sweatshirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_200 = Tag.create!(name: 'Tanks', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_201 = Tag.create!(name: 'Teddies', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_202 = Tag.create!(name: 'Teddy Lingerie', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_203 = Tag.create!(name: 'Thongs', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_204 = Tag.create!(name: 'Tights', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_205 = Tag.create!(name: 'T-Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_11.id)
#   @sub_cat_tag_206 = Tag.create!(name: 'Bralets', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_207 = Tag.create!(name: 'Camis', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_208 = Tag.create!(name: 'Cardigans', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_209 = Tag.create!(name: 'Crop Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_210 = Tag.create!(name: 'Dresses', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_211 = Tag.create!(name: 'Pants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_212 = Tag.create!(name: 'Polo Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_213 = Tag.create!(name: 'Shell Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_214 = Tag.create!(name: 'Skirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_215 = Tag.create!(name: 'Sweaters', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_216 = Tag.create!(name: 'Sweatpants', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_217 = Tag.create!(name: 'Sweatshirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_218 = Tag.create!(name: 'Tanks', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_219 = Tag.create!(name: 'Tank Tops', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_220 = Tag.create!(name: 'Teddy Lingerie', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_221 = Tag.create!(name: 'T-Shirts', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)
#   @sub_cat_tag_222 = Tag.create!(name: 'Tunics', attribute_id: @attr_3.id, parent_tag_id: @parent_tag_3.id)

#   @brand_1 = Tag.create!(name: "adidas", attribute_id: @attr_4.id)
#   @brand_2 = Tag.create!(name: "ASOS DESIGN", attribute_id: @attr_4.id) 
#   @brand_3 = Tag.create!(name: "Bershka", attribute_id: @attr_4.id) 
#   @brand_4 = Tag.create!(name: "Emory Park", attribute_id: @attr_4.id) 
#   @brand_5 = Tag.create!(name: "Missguided Tall", attribute_id: @attr_4.id) 
#   @brand_6 = Tag.create!(name: "One Teaspoon", attribute_id: @attr_4.id) 
#   @brand_7 = Tag.create!(name: "Paper Dolls", attribute_id: @attr_4.id) 
#   @brand_8 = Tag.create!(name: "Peek & Beau", attribute_id: @attr_4.id) 
#   @brand_9 = Tag.create!(name: "Pull&Bear", attribute_id: @attr_4.id) 
#   @brand_10 = Tag.create!(name: "RahiCali", attribute_id: @attr_4.id) 
#   @brand_11 = Tag.create!(name: "Simply Be", attribute_id: @attr_4.id) 
#   @brand_12 = Tag.create!(name: "Stradivarius", attribute_id: @attr_4.id) 
#   @brand_13 = Tag.create!(name: "The North Face", attribute_id: @attr_4.id) 
#   @brand_14 = Tag.create!(name: "Wild Honey", attribute_id: @attr_4.id) 

#   @color_1 = Tag.create!(name: "Beige", attribute_id: @attr_5.id)
#   @color_2 = Tag.create!(name: "Black", attribute_id: @attr_5.id)
#   @color_3 = Tag.create!(name: "Black multi", attribute_id: @attr_5.id)
#   @color_4 = Tag.create!(name: "Blue", attribute_id: @attr_5.id)
#   @color_5 = Tag.create!(name: "Blush", attribute_id: @attr_5.id)
#   @color_6 = Tag.create!(name: "Brown", attribute_id: @attr_5.id)
#   @color_7 = Tag.create!(name: "Cherry print", attribute_id: @attr_5.id)
#   @color_8 = Tag.create!(name: "Dusty pink multi", attribute_id: @attr_5.id)
#   @color_9 = Tag.create!(name: "Green", attribute_id: @attr_5.id)
#   @color_10 = Tag.create!(name: "Ivory", attribute_id: @attr_5.id)
#   @color_11 = Tag.create!(name: "Mellow yellow", attribute_id: @attr_5.id)
#   @color_12 = Tag.create!(name: "Multi", attribute_id: @attr_5.id)
#   @color_13 = Tag.create!(name: "Multi stripe", attribute_id: @attr_5.id)
#   @color_14 = Tag.create!(name: "Navy", attribute_id: @attr_5.id)
#   @color_15 = Tag.create!(name: "Navy blue", attribute_id: @attr_5.id)
#   @color_16 = Tag.create!(name: "Orange", attribute_id: @attr_5.id)
#   @color_17 = Tag.create!(name: "Pink", attribute_id: @attr_5.id)
#   @color_18 = Tag.create!(name: "Pink salt", attribute_id: @attr_5.id)
#   @color_19 = Tag.create!(name: "Tnf medium grey heat", attribute_id: @attr_5.id)
#   @color_20 = Tag.create!(name: "White", attribute_id: @attr_5.id)
#   @color_21 = Tag.create!(name: "White marble", attribute_id: @attr_5.id)
#   @color_22 = Tag.create!(name: "White multi", attribute_id: @attr_5.id)
#   @color_23 = Tag.create!(name: "Yellow", attribute_id: @attr_5.id)
#   @color_24 = Tag.create!(name: "Red Multi", attribute_id: @attr_5.id)

#   @feature_tag_1 = Tag.create!(name: "Surfer", attribute_id: @attr_6.id)
#   @feature_tag_2 = Tag.create!(name: "Festival", attribute_id: @attr_6.id)
#   @feature_tag_3 = Tag.create!(name: "Occasion", attribute_id: @attr_6.id)

#   ProductTag.destroy_all

#   open("https://raw.githubusercontent.com/Aw-bree/seedHelper/master/asauce_create_product_tags.json") do |products|
#     data = []

#     products.read.each_line do |product|
#       @item = JSON.parse(product, :quirks_mode => true)
#       object = {
#         "product_code": @item["product_code"],
#         "tags": @item["tags"]
#       }
#       data << object
#     end
    
#     data.each do |prods|
#       code = prods[:product_code]
#       @product = Product.find_by(product_code: code)

#       tags = prods[:tags]
#       tags.map!{|k| instance_variable_get("#{k}")}
#       tags.each do |product_tag|
#         ProductTag.create!(product_id: @product.id, tag_id: product_tag.id )
#       end
    
#     end
#   end
# end

ActiveRecord::Base.transaction do
  ProductItem.destroy_all
  
  products = Product.all

  products.each do |product|
    ProductItem.create!({product_id: product.id, size: "XS", state: "Available"})
    2.times { ProductItem.create!({product_id: product.id, size: "S", state: "Available"}) }
    2.times { ProductItem.create!({product_id: product.id, size: "M", state: "Available"}) }
    ProductItem.create!({product_id: product.id, size: "L", state: "Available"})
    ProductItem.create!({product_id: product.id, size: "XL", state: "Available"})
  end

end