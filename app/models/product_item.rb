# == Schema Information
#
# Table name: product_items
#
#  id         :bigint           not null, primary key
#  product_id :integer          not null
#  size       :string
#  state      :string
#

class ProductItem < ApplicationRecord
  validates :product_id, :size, :state, presence: true

  has_many_attached :photos
  belongs_to :product
end
