FROM ruby:2.4.2

RUN apt-get update -qq && apt-get install -y build-essential

ENV APP_HOME /api 
RUN mkdir $APP_HOME  
WORKDIR $APP_HOME

ADD Gemfile* $APP_HOME/  
RUN bundle install

ADD . $APP_HOME  