class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :session_token, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.date :date_of_birth
      t.string :gender, null: false
      t.string :country, null: false
      t.string :email_lists,	array: true, default: []
    end
    add_index :users, :email, unique: true
    add_index :users, :session_token
  end
end
