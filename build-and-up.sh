#!/bin/bash
# Build the JAR using Maven
mvn -f ./backend_api/pom.xml clean install -DskipTests

# Start docker-compose and rebuild the image if needed
docker-compose up --build -d

