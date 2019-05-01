class SessionsController < ApplicationController
  def new
    render :new
  end

  def create
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

    if @user.nil?
      flash.now[:errors] = ['Looks like either your email address or password were incorrect. Wanna try again?']
      render :new
    else
      login!(@user)
      # should be splash page
      redirect_to root_url
    end

  end

  def destroy
    logout!
    redirect_to new_session_url
  end
end