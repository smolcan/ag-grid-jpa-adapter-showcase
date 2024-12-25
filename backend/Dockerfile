# Use a lightweight JDK image to run the application
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copy the pre-built JAR file from the host machine
COPY target/ag-grid-jpa-adapter-showcase-0.0.1-SNAPSHOT.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Set the default command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]