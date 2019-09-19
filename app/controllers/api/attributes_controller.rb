class Api::AttributesController < ApplicationController
  
  def create
    @attribute = Attribute.new(attribute_params)
    if @attribute.save
      render :json => @attribute.to_json
    else
      render :json => { :errors => @attribute.errors }
    end
  end

  def index
    @attributes = Attribute.all
    render :index
  end

  private

  def attribute_params
    params.require(:attribute).permit(:name)
  end
end
