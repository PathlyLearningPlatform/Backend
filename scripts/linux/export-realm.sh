docker run --rm \
  --entrypoint /opt/keycloak/bin/kc.sh \
  -v pathly_auth-data:/opt/keycloak/data \
  -v $(pwd)/services/auth:/tmp/export \
  $(docker build -q ./services/auth --target dev) \
  export --file /tmp/export/realm-export.json --realm pathly --users same_file