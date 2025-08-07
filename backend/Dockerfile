FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar ProjectManagement.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "ProjectManagement.jar"]