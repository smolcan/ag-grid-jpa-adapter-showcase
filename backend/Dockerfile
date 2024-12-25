
# BUILD STAGE
FROM openjdk:21-jdk-slim as build
WORKDIR /app
ADD . /app
RUN --mount=type=cache,target=/root/.m2 ./mvnw -f /app/pom.xml clean package

# run stage
FROM openjdk:21-jdk-slim
WORKDIR /app
# Copy the pre-built JAR file from the host machine
COPY --from=build /app/target/ag-grid-jpa-adapter-showcase-0.0.1-SNAPSHOT.jar app.jar
# Expose the default Spring Boot port
EXPOSE 8080
# Set the default command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]