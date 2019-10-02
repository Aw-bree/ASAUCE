class Api::OrderItemsController < ApplicationController

  def create
    @order_item = OrderItem.new(order_item_params)

    if @order_item.save
      render 'api/order_items/show'
    else 
      render json: @order_item.errors.messages, status: 422
    end
  end

  def index
    @order_items = OrderItems.find_by(order_id: params[:order_id])
    render "api/order_items/index"
  end

  def destroy
    @order = Order.find_by(user_id: current_user.id)
    @order_item = OrderItem.find(params[:id])
    @current_user_order_item = OrderItem.where('order_id = ? && order_item_id = ?', @order.id, @order_item.id)

    if @current_user_order_item
      @order_item.destroy
      render :show
    end
  end

  private

  def order_item_params
    params.require(:orderItem).permit(:product_item_id, :order_id)
  end
end
