class Api::UsersController < ApplicationController
  
  def create
    @user = User.new(user_params)
    
    if @user.save
      login!(@user)
      create_order!(@user.id)
      render :show
    else
      render json: @user.errors.messages, status: 401
    end
  end
  
  def show
    @user = selected_user
  end
  
  private
  
  def selected_user
    User.includes(:order_items).where(:id => params[:id])
  end
  
  def user_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :country, :gender)
  end
end

