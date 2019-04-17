class SecureEnvironment

  def initialize(key_id: 'alias/my-secrets', app_name: 'my-factory-store', s3_bucket: 'app-secrets')

    @client = Aws::SSM::Client.new
    @key_id = key_id
    @app_name = app_name
    @scope = Sinatra::Base.development? ? 'env_dev' : 'env'
    @s3_bucket = s3_bucket
  end

  def describe_parameters(next_token=nil)
    parameters = []
    parameters_page = @client.describe_parameters({
      filters: [
        key: 'KeyId', values:[@key_id]
      ], next_token: next_token
    })
    parameters << parameters_page.parameters
    parameters << describe_parameters(parameters_page.next_token) if parameters_page.next_token
    return parameters.flatten
  end

  def keys
    describe_parameters.map {|p| p.name }
  end

  def list(keys_array=keys)
    if keys_array.size <= 10
      @client.get_parameters({
        names: keys_array, with_decryption: true
      }).parameters.map {|p| {name: name_from_key(p.name), value: p.value}}
    else
      values = []
      keys_array.each_slice(10).to_a.each {|ka| values << list(ka)}
      values.flatten
    end    
  end

  def find(secret_name)
    param = @client.get_parameters({names: [secret_name], with_decryption: true})    
    if param.invalid_parameters.include?(secret_name)
      nil
    else
      {name: name_from_key(param.parameters.first.name), 
      value: param.parameters.first.value}
    end    
  end

  def save(name, value)
    @client.put_parameter({
      name: key_name(name), value: value, 
      type: 'SecureString', key_id: @key_id, 
      overwrite: true
    })
  end

  def delete(name)
    @client.delete_parameter({
      name: key_name(name)
    })
  end

  def key_name(name)
    "#{@app_name}.#{@scope}.#{name}"
  end

  def name_from_key(key_name)
    key_name.split('.').last
  end

  def keys_by_scope
    keys.select do |k| 
      k.split('.').size>2 && k.split('.').first==@app_name && k.split('.')[1]==@scope
    end
  end

  def find_by_scope
    list(keys_by_scope)
  end

  def save_dotenv(dotenv_path='.env')
    environment_text = File.read(dotenv_path)
    Dotenv::Parser.call(environment_text).each { |k,v| save(k,v) }
  end

  def load_env
    find_by_scope(@scope).each { |env_var| ENV[env_var[:name]]=env_var[:value] }
  end

  def export_env
    exports = ""
    find_by_scope.each { |env_var| exports << "export #{env_var[:name]}=#{env_var[:value]}\n" }
    exports
  end

  def save_to_s3
    s3 = Aws::S3::Client.new
    resp = s3.put_object({
      body: export_env,
      bucket: @s3_bucket,
      key: "#{@app_name}-#{@scope}.env",
      server_side_encryption: 'aws:kms',
      ssekms_key_id: @key_id
    })
  end

  def load_from_s3
    s3 = Aws::S3::Client.new
    resp = s3.get_object({bucket: @s3_bucket, key: "#{@app_name}-#{@scope}.env"})
    resp.body.read
  end

  def save_to_dotenv(dotenv_path:'.env_from_aws',keys_filter:nil)
    keys_to_write = keys_filter ? keys_filter.map{|k| key_name(k)} : keys_by_scope
    env_vars = list(keys_to_write)
    File.open(dotenv_path, 'w') do |f|
      env_vars.each { |env_var| f << "export #{env_var[:name]}=#{env_var[:value]}\n" }
    end    
  end
  
end