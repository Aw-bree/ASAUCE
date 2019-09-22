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
    @productItems = ProductItem.all
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


  def update
    @product_item = ProductItem.find(params[:id])
    
    if @product_item.update(product_item_params)
      render :index
    else
      render json: ['Try AGAIN'], status: 422
    end
  end

  def update

    @product_item = ProductItem.find(params[:id])

    if @product_item.update(product_item_params)
      render :show
    else
      render json: ['Try AGAIN'], status: 422
    end
  end

  private

  def product_item_params
    params.require(:product_item).permit(:id, :product_id, :size, :state)
  end
end

  
  


