class Api::AttributesController < ApplicationController

  def index
    @attributes = Attribute.all
    render :index
  end

  private

  def attribute_params
    params.require(:attribute).permit(:name, :data)
  end
end
