# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  first_name      :string           not null
#  last_name       :string           not null
#  date_of_birth   :date
#  gender          :string           not null
#  country         :string           not null
#  email_lists     :string           default([]), is an Array
#

class User < ApplicationRecord
  @countries = ['United States', 'Canada']
  @gender = ['Male', 'Female']

  validates :email, presence: true, uniqueness: true
  validates :password_digest, :session_token, :first_name, :last_name, presence: true
  validates :password, length: { minimum: 6 }, allow_nil: true
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create
  # got const validations from: https://stackoverflow.com/questions/12059415/rails-validate-in-model-that-value-is-inside-array
  validates :gender, :inclusion=> { :in => @gender }
  validates :country, :inclusion=> { :in => @countries }

  after_initialize :ensure_session_token

  attr_reader :password

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    # this won't check the password unless it first found a user by that email
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64
    self.save
    self.session_token
  end
end
