class CreateTableOrders < ActiveRecord::Migration[5.2]
  def change
    create_table :orders do |t|
       t.integer :user_id,	null: false, foreign_key: true
       t.string :delivery_type
       t.string :shipping_state
    end

    add_index :orders, :user_id
  end
end
