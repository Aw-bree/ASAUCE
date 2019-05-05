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
    @products = Product.all
    render :index
  end

  def show
    @product = Product.find(params[:id])
    
    if @product
      render :show
    else
      render json: @product.errors.full_messages, status: 404
    end
  end

  private

  def product_params
    params.require(:product).permit(
      :title, :description, :model_size, :model_height, 
      :fabric_stretch, :fabric_material, :main_fiber_content, 
      :care_advice, :care_instructions, :price, :markdown, photos: [])
  end
end
