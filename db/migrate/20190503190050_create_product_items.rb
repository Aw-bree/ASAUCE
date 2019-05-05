class CreateProductItems < ActiveRecord::Migration[5.2]
  def change
    create_table :products_items do |t|
      t.integer :product_id,	null: false
      t.string :size
      t.string :state
      t.foreign_key :products, column: :product_id
    end

    add_index :product_items, :state  end
end
