class AddAttributes < ActiveRecord::Migration[5.2]
  def change
    create_table :attributes do |t|
      t.integer :name, null: false
    end
  end
end
