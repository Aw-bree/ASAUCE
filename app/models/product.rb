# == Schema Information
#
# Table name: products
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  product_code       :integer          not null
#  title              :string
#  description        :string
#  model_size         :string
#  model_height       :string
#  fabric_stretch     :string
#  fabric_material    :string
#  main_fiber_content :string
#  care_advice        :string
#  care_instructions  :string
#  price              :decimal(, )      not null
#  markdown           :decimal(, )
#

class Product < ApplicationRecord
  validates :product_code, :price, presence: true

  has_many_attached :photos
end
