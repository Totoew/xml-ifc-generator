FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY XML-IFC-generator.csproj ./
RUN dotnet restore XML-IFC-generator.csproj

COPY . ./
RUN dotnet publish XML-IFC-generator.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "XML-IFC-generator.dll"]
