class Api::TagsController < ApplicationController
  
  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render :json => @tag.to_json
    else
      render :json => { :errors => @tag.errors }
    end
  end

  def index
    @tags = Tag.all
    render :index
  end

  def tag_params
    params.require(:tag).permit(:name, :attribute_id, :parent_tag_id)
  end
end
