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
    User.find(params[:id])
  end
  
  def user_params
    params.require(:user).permit(:email, :password, :gender, :country, :email_lists, :date_of_birth, :first_name, :last_name)
  end
end

