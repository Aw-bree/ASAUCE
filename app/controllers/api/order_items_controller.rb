class Api::OrderItemsController < ApplicationController

  def create
    @order_item = OrderItem.new(order_item_params)

    if @order_item.save
      @product_item = ProductItem.find_by(id: @order_item.product_item_id)
      @product = Product.find_by(id: @product_item.product_id)
      @order_items = @order_item.order.order_items.select{|el| el.product.id == @product.id }
      render 'api/order_items/show'
    else 
      render json: @order_item.errors.full_messages, status: 422
    end
  end

  def update
    @order_items = OrderItem.where(order_id: params[:order_id])
    render 'api/order_items/index'
  end

  def index
    @order_items = OrderItems.find_by(order_id: params[:order_id])
    render "api/order_items/index"
  end

  def show
    @order_item = OrderItem.find_by(id: params[:id])
    @product_item = ProductItem.find_by(id: @order_item.product_item_id)
    @product = Product.find_by(id: @product_item.product_id)
    @order_items = OrderItem.all.where(product_id: @product.id, order_id: @order_item.id)
    render 'api/order_items/show'
  end

  def destroy
    @order = Order.find_by(user_id: current_user.id)
    orderId = @order.id
    @order_items = OrderItem.where('order_id = ?', @order.id)

    @order_item = OrderItem.find(params[:id])
    @product_item = ProductItem.find_by(id: @order_item.product_item_id)
    @product = Product.find_by(id: @product_item.product_id)
    @order_item.destroy
    
    render :show
   

    # orderItemId = params[:id]
    # @order_item = OrderItem.includes(:order_items).where('id = ?', orderItemId).first
    # @order_items = @order_item.order_items
    
    # if @order_item
    #   @order_item.destroy
    #   @product_item = ProductItem.find_by(id: @order_item.product_item_id)
    #   @product = Product.find_by(id: @product_item.product_id)
    #   render 'api/order_items/index'
    # end
  end

  private

  def order_item_params
    params.require(:orderItem).permit(:product_item_id, :order_id)
  end
end
