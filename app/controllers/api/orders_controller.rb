class Api::OrdersController < ApplicationController

  def create(user_id)
    @order = Order.new({user_id: user_id})

    if @order.save
      render json: ['Success!'], status: 200
    else
      render json: @order.errors.full_messages, status: 404
    end
  end

  def show 
    orderId = params[:id].to_s
    @order = Order.includes(:order_items, :product_items, :products).where('id = ?', orderId).first

    if @order 
      render 'api/orders/show'
    end
  end


  private
  def order_params

    params.require(:order).permit(:id, :user_id, :delivery_type, :state)
  end
end
