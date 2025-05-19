FROM openjdk:17-jdk-slim

MAINTAINER SKCodify

COPY target/myco-0.0.1-SNAPSHOT.jar myco.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "myco.jar"]

