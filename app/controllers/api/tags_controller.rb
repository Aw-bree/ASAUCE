class Api::TagsController < ApplicationController

  def index
    @tags = Tag.all
    render :index
  end

  def tag_params
    params.require(:tag).permit(:name, :attribute_id, :parent_tag_id)
  end
end
