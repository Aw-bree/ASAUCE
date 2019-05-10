# == Schema Information
#
# Table name: orders
#
#  id             :bigint           not null, primary key
#  user_id        :integer          not null
#  delivery_type  :string
#  shipping_state :string
#


class Order < ApplicationRecord
  validates :user_id, presence: true

  belongs_to :user
  has_many :order_items
  has_many :product_items, through: :order_items
  has_many :products, through: :product_items
end
