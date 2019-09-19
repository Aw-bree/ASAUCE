class AddProductTags < ActiveRecord::Migration[5.2]
  def change
    create_table :product_tags do |t|
      t.timestamps
      t.integer :product_id, null: false
      t.integer :tag_id, null: false
    end

    add_index :product_tags, :product_id
    add_index :product_tags, :tag_id
  end
end
