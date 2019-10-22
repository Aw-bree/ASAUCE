class Api::OrdersController < ApplicationController

  def create(user_id)
    @order = Order.new({user_id: user_id})

    if @order.save
      render :json => @order.to_json
    else
      render json: @order.errors.messages, status: 404
    end
  end

  def show 
    order_id = params[:id].to_s
    @order = Order.includes(:order_items, :product_items, :products, :tags).where('id = ?', order_id).first

    if @order 
      render 'api/orders/show'
    end
  end

  private
  def order_params
    params.require(:order).permit(:id, :user_id, :delivery_type, :state)
  end
end
