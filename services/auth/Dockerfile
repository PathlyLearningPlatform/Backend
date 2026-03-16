FROM quay.io/keycloak/keycloak:26.4.7 AS base

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

FROM base AS dev

COPY ./realm-export.json /opt/keycloak/data/import/

RUN /opt/keycloak/bin/kc.sh build

CMD ["start-dev", "--import-realm"]

EXPOSE 8080

FROM base AS prod

RUN /opt/keycloak/bin/kc.sh build

CMD ["start"]

EXPOSE 8080