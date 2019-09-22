class Api::ProductsController < ApplicationController
  
  def create
    @product = Product.new(product_params)
    if @product.save
      render :json => @product.to_json
    else
      render :json => { :errors => @product.errors }
    end
  end

  def index
    @products = Product.limit(12)
    render :index
  end

  def show
    @product = Product.with_attached_photos.find(params[:id])
    @product_items = @product.product_items
    if current_user
      @orders = current_user.current_order
      @order_items = Order.find(@orders[0].id).order_items
    end
    
    if @product
      render :show
    else
      render json: @product.errors.full_messages, status: 404
    end
  end
end
