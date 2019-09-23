json.extract! @user, :id, :email, :first_name
json.currentOrderId current_user.current_order[0].id