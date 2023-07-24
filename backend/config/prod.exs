import Config

# For production, don't forget to configure the url host
# to something meaningful, Phoenix uses this information
# when generating URLs.
#
# Note we also include the path to a cache manifest
# containing the digested version of static files. This
# manifest is generated by the `mix phx.digest` task,
# which you should run after static files are built and
# before starting your production server.
config :dragncards, DragnCardsWeb.Endpoint,
  http: [port: 4000],
  url: [host: "beta.dragncards.com", port: 4000],
  cache_static_manifest: "priv/static/cache_manifest.json",
  check_origin: ["//localhost", "//beta.dragncards", "//beta.dragncards.com", "//www.beta.dragncards.com"],
  # check_origin: [
  #   "//dragncards.com",
  #   "//api.dragncards.com",
  #   "//localhost",
  #   "//172.22.2.30:31231",
  #   "//172.22.2.31:31231",
  #   "//172.22.2.32:31231",
  #   "//172.22.2.33:31231",
  #   "//172.22.2.30:31232",
  #   "//172.22.2.31:31232",
  #   "//172.22.2.32:31232",
  #   "//172.22.2.33:31232"
  # ],
  front_end_email_confirm_url: "http://dragncards.com/confirm-email/{token}",
  front_end_reset_password_url: "http://dragncards.com/reset-password/{token}"

# Do not print debug messages in production
config :logger, level: :info

# ## SSL Support
#
# To get SSL working, you will need to add the `https` key
# to the previous section and set your `:url` port to 443:
#
#     config :dragncards, DragnCardsWeb.Endpoint,
#       ...
#       url: [host: "example.com", port: 443],
#       https: [
#         :inet6,
#         port: 443,
#         cipher_suite: :strong,
#         keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
#         certfile: System.get_env("SOME_APP_SSL_CERT_PATH")
#       ]
#
# The `cipher_suite` is set to `:strong` to support only the
# latest and more secure SSL ciphers. This means old browsers
# and clients may not be supported. You can set it to
# `:compatible` for wider support.
#
# `:keyfile` and `:certfile` expect an absolute path to the key
# and cert in disk or a relative path inside priv, for example
# "priv/ssl/server.key". For all supported SSL configuration
# options, see https://hexdocs.pm/plug/Plug.SSL.html#configure/1
#
# We also recommend setting `force_ssl` in your endpoint, ensuring
# no data is ever sent via http, always redirecting to https:
#
#     config :dragncards, DragnCardsWeb.Endpoint,
#       force_ssl: [hsts: true]
#
# Check `Plug.SSL` for all available options in `force_ssl`.

# No longer using prod.secret.exs - Letting
# the release system check releases.exs at runtime
import_config "prod.secret.exs"
