class AddTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.integer :attribute_id, null: false, foreign_key: true
      t.integer :parent_tag_id
      t.string :name, null: false
    end

    add_index :tags, :attribute_id
    add_index :tags, :parent_tag_id
  end
end