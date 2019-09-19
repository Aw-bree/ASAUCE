# == Schema Information
#
# Table name: attributes
#
#  id   :bigint           not null, primary key
#  name :string           not null
#

class Attribute < ApplicationRecord
  validates :name, presence: true
  validates :name, uniqueness: true

  has_many :tags
  has_many :products, through: :tags
end
