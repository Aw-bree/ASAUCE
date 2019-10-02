json.extract! user, :id, :email, :first_name

if !current_user.nil?
  json.currentOrderId current_user.current_order[0].id
end