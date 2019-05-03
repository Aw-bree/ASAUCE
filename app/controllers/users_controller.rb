class UsersController < ApplicationController

  def new
    @user = User.new
    render :new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login!(@user)
      redirect_to root_url
    else
      #$ custom message here
      flash.now[:errors] = @user.errors.full_messages
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
    if @user
      render :show
    else
      render json: @user.errors.full_messages, status: 404
    end
  end

  # #$$ will not need this
  # def index
  #   @users = User.all
  #   render :index
  # end

  # # #$$ will not need this
  # def edit
  #   @user = User.find(params[:id])
  #   render :edit
  # end

  # #$$ will not need this
  # def update
  #   @user = User.find(params[:id])
  #   if @user.update(user_params)
  #     redirect_to user_url(@user)
  #   else
  #     render json: @user.errors.full_messages, status: 422
  #   end
  # end

  # #$$ will not need this
  # def destroy
  #   @user = User.find(params[:id])
  #   if @user.destroy
  #     redirect_to users_url
  #   else
  #     render plain: "You can't destroy what's not there."
  #   end
  # end

  # #$$ will not need this 
  # def search
  #   @users = User.where("username LIKE '%#{params[:query]}%'")
  #   render json: @users
  # end

  private

  def user_params
    params.require(:user).permit(:email, :password, :first_name)
  end
end