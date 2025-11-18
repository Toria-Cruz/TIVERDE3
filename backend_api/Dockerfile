# Imagem leve e compatível com o Java que você compilou
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copia o arquivo .jar gerado pelo Maven
COPY target/*.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]