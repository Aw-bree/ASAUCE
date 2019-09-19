# == Schema Information
#
# Table name: tags
#
#  id            :bigint           not null, primary key
#  attribute_id  :integer          not null
#  parent_tag_id :integer
#  name          :string           not null
#

class Tag < ApplicationRecord
  validates :name, presence: true
  validates :attribute_id, presence: true

  belongs_to :tag_attribute, :class_name => "Attribute", :foreign_key => :attribute_id
  has_many :product_tags
  has_many :products, through: :product_tags
end
