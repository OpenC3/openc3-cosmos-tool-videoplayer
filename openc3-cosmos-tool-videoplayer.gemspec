# encoding: ascii-8bit

# Copyright 2022 Ball Aerospace & Technologies Corp.
# All Rights Reserved.
#
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# This program may also be used under the terms of a commercial or
# enterprise edition license of COSMOS if purchased from the
# copyright holder

# Modified by OpenC3, Inc.
# All changes Copyright 2025, OpenC3, Inc.
# All Rights Reserved
#
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.

# Create the overall gemspec
spec = Gem::Specification.new do |s|
  s.name = 'openc3-cosmos-tool-videoplayer'
  s.summary = 'Video Player Tool for OpenC3 COSMOS'
  s.description = <<-EOF
    This plugin adds the COSMOS Video Player tool
  EOF
  s.authors = ['Ryan Melton', 'Jason Thomas', 'Gerhard van Andel', 'Ryan Pratt']
  s.email = ['ryan@openc3.com', 'jason@openc3.com', 'gerhard.vanandel@ballaerospace.com', 'ryan.pratt@openc3.com']
  s.homepage = 'https://github.com/OpenC3/openc3-cosmos-tool-videoplayer'

  s.platform = Gem::Platform::RUBY

  if ENV['VERSION']
    s.version = ENV['VERSION'].dup
  else
    s.version = '0.0.0'
  end
  s.licenses = ['AGPL-3.0-only', 'Nonstandard']

  s.files = Dir.glob("{targets,lib,procedures,tools,microservices}/**/*") + %w(Rakefile LICENSE.txt README.md plugin.txt)
end
