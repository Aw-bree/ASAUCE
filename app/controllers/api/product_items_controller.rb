class Api::ProductItemsController < ApplicationController
  def create
    @productItem = ProductItem.new(product_item_params)
    if @productItem.save
      render :json => @productItem.to_json
    else
      render :json => { :errors => @productItem.errors }
    end
  end

  def index
    @productItems = ProductItems.all
    render :index
  end

  def show
    @productItem = ProductItem.find(params[:id])
    
    if @productItem
      render :show
    else
      render json: @productItem.errors.full_messages, status: 404
    end
  end

  private

  def product_item_params
    params.require(:product_item).permit(:product_id, :size, :state)
  end
end

  
  


