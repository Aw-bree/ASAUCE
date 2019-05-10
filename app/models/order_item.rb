# == Schema Information
#
# Table name: order_items
#
#  id              :bigint           not null, primary key
#  order_id        :integer          not null
#  product_item_id :integer          not null
#


class OrderItem < ApplicationRecord
  validates :order_id, :product_item_id, presence: true

  belongs_to :order
  belongs_to :product_item
  has_one :product, through: :product_item
  has_many :order_items, through: :order
end
