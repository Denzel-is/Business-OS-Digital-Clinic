# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw \
    && ./mvnw -B -DskipTests dependency:go-offline

COPY src/ src/
RUN ./mvnw -B -DskipTests clean package

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN apk upgrade --no-cache \
    && apk add --no-cache curl \
    && addgroup -S businessos \
    && adduser -S -G businessos -h /app businessos

WORKDIR /app

COPY --from=build --chown=businessos:businessos \
    /workspace/target/business-os-backend-*.jar /app/app.jar
COPY --chown=businessos:businessos docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod 0555 /usr/local/bin/docker-entrypoint.sh

USER businessos

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
