class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def login!(user)
    session[:session_token] = user.session_token
  end

  def logged_in?
    !current_user.nil?
  end

  def logout!
    current_user.reset_session_token!
    session[:session_token] = nil
  end
  
  def require_logged_out
    if logged_in?
      redirect_to root_url
    end
  end

  def require_logged_in
    if !logged_in?
      redirect_to root_url
    end
  end

  def create_order!(user_id)
    Order.create({user_id: user_id})
    nil
  end
end
