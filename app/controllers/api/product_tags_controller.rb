class Api::ProductTagsController < ApplicationController
  
  def create
    @product_tag = ProductTag.new(product_tag_params)
    if @product_tag.save
      render :json => @product_tag.to_json
    else
      render :json => { :errors => @product_tag.errors }
    end
  end

  def index
    @product_tags = ProductTag.all
    render :index
  end

  def product_tag_params
    params.require(:product_tag).permit(:tag_id, :product_id)
  end
end
