class CreateOrderItems < ActiveRecord::Migration[5.2]
  def change
    create_table :order_items do |t|
      t.integer :order_id, null: false, foreign_key: true
      t.integer :product_item_id, null: false,  foreign_key: true
    end

    add_index :order_items, :product_item_id
    add_index :order_items, [:product_item_id, :order_id], unique: true
  end
end
