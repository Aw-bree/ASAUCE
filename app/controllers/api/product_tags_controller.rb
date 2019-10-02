class Api::ProductTagsController < ApplicationController

  def index
    @product_tags = ProductTag.all
    render :index
  end

  def product_tag_params
    params.require(:product_tag).permit(:tag_id, :product_id)
  end
end
