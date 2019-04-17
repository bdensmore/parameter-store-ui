require 'sinatra'
require 'sinatra/cross_origin'
require 'pry-remote'
require 'json'
require 'aws-sdk'
require 'dotenv'
require 'securerandom'
require './secure_environment.rb'

Dotenv.load

configure do
  enable :cross_origin
end

before do
  response.headers['Access-Control-Allow-Origin'] = '*'
end

post '/login' do
  message = {response: 401, message: 'Invalid Login'}
  if params[:aws_access_key].nil? || params[:aws_secret_key].nil? || params[:aws_region].nil?
    session[:logged_in] = false
  else
    # Aws.config.update({
    #   region: "#{params[:aws_region]}",
    #   credentials: Aws::Credentials.new(params[:aws_access_key], params[:aws_secret_key])
    # })
    ENV['AWS_REGION'] = params[:aws_region]
    ENV['AWS_ACCESS_KEY_ID'] = params[:aws_access_key]
    ENV['AWS_SECRET_ACCESS_KEY'] = params[:aws_secret_key]
    session[:logged_in] = true
    message = {response: 200, message: 'Logged In', token: SecureRandom.hex(13) } 
  end
  content_type :json
  message.to_json
end

get '/logout' do
  session[:logged_in] = false
  ENV['AWS_REGION'] = nil
  ENV['AWS_ACCESS_KEY_ID'] = nil
  ENV['AWS_SECRET_ACCESS_KEY'] = nil
  content_type :json
  {reponse: 200, message: 'Logged Out'}
end

get '/list' do
  message = {response: 400, message: 'Error', data: []}
  begin
    se = SecureEnvironment.new
    se.list
    message = {response: 200, message: 'Data Retrieved', data: se.list}
  rescue => exception
    message = {response: 400, message: "Error: #{exception}" , data: []}    
  end
  content_type :json
  message.to_json
end


get '/search' do
  
end

post '/save' do
  name = params[:key_name]
  value = params[:key_value]
  se = SecureEnvironment.new
  se.save(name,value)
  content_type :json
  se.list.to_json
end

post '/destroy/:key_name' do
  begin
    name = params[:key_name]
    se = SecureEnvironment.new
    se.delete(name)
    content_type :json
    se.list.to_json
  rescue => exception
    content_type :json
    exception
  end

end

options "*" do
    response.headers["Allow"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-Requested-With, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
end