Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: { format: :json } do
    resources :users
    resources :products, only: [:show, :index]
    resources :product_items, only: [:update]
    resource :session, only: [:new, :create, :destroy]
    resources :orders, only: [:create, :show] do
        resources :order_items, except: [:new, :edit]
      end
  end

  root to: 'root#root'
end
