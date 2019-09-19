class ChangeNameToBeStringInAttributes < ActiveRecord::Migration[5.2]
  def change
    change_column :attributes, :name, :string
  end
end
