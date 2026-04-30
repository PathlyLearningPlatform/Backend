FROM quay.io/keycloak/keycloak:26.4.7 AS base

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# plugins for webhooks
ADD --chown=keycloak:keycloak https://github.com/vymalo/keycloak-webhook/releases/download/v0.10.0-rc.1/keycloak-webhook-provider-core-0.10.0-rc.1-all.jar /opt/keycloak/providers
ADD --chown=keycloak:keycloak https://github.com/vymalo/keycloak-webhook/releases/download/v0.10.0-rc.1/keycloak-webhook-provider-http-0.10.0-rc.1-all.jar /opt/keycloak/providers

COPY --chown=keycloak:keycloak ./secrets /opt/keycloak/secrets

FROM base AS dev

COPY ./realm-export.json /opt/keycloak/data/import/

RUN /opt/keycloak/bin/kc.sh build --vault=file

CMD ["start-dev", "--import-realm", "--vault-dir=/opt/keycloak/secrets", "--vault=file"]

EXPOSE 8080

FROM base AS prod

RUN /opt/keycloak/bin/kc.sh build --vault=file

CMD ["start", "--vault-dir=/opt/keycloak/secrets", "--optimized"]

EXPOSE 8080