class Api::ProductItemsController < ApplicationController

  def index
    @product_items = ProductItem.all
    render :index
  end

  def show
    @product_item = ProductItem.find(params[:id])
    
    if @product_item
      render :show
    else
      render json: @product_item.errors.messages, status: 404
    end
  end

  def update
    @product_item = ProductItem.find(params[:id])
    
    if @product_item.update(product_item_params)
      render :show
    else
      render json: @product_item.errors.messages, status: 422
    end
  end

  private

  def product_item_params
    params.require(:product_item).permit(:id, :product_id, :size, :state)
  end
end

  
  


