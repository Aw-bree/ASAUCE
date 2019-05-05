class UpdateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.timestamps
      t.integer :product_code,	null: false
      t.string :title
      t.string :description
      t.string :model_size
      t.string :model_height
      t.string :fabric_stretch
      t.string :fabric_material
      t.string :main_fiber_content
      t.string :care_advice
      t.string :care_instructions
      t.decimal :price,	null: false
      t.decimal :markdown
    end
    add_index :products, :title
  end
end
