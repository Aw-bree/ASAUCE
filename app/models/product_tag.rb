# == Schema Information
#
# Table name: product_tags
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  product_id :integer          not null
#  tag_id     :integer          not null
#

class ProductTag < ApplicationRecord
  validates :product_id, :tag_id, presence: true

  belongs_to :product
  belongs_to :tag
  has_one :tag_attribute, through: :tag
end
