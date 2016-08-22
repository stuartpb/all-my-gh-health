#!/usr/bin/env ruby

require 'github-pages-health-check'

check = GitHubPages::HealthCheck::Site.new(ARGV[0])
puts "#{ARGV[0]}: #{check.valid? ? 'OK' : check.reason.message}"
