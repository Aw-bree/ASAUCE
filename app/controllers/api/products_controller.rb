class Api::ProductsController < ApplicationController

  def index
    @products = Product.includes(:tags).with_attached_photos
    render :index
  end

  def search
    render :index
  end

  def show
    @product = Product.includes(:product_items, :tags).with_attached_photos.find(params[:id])
    
    if @product
      render :show
    else
      render json: @product.errors.messages, status: 404
    end
  end
end
