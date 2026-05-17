namespace XML_IFC_generator.Services;

public sealed class FileXmlSchemaProvider : IXmlSchemaProvider
{
    private const string SchemaFileName = "construction-project.xsd";
    private readonly IWebHostEnvironment environment;
    private string? cachedSchema;

    public FileXmlSchemaProvider(IWebHostEnvironment environment)
    {
        this.environment = environment;
    }

    public string GetProjectSchema()
    {
        if (cachedSchema is not null)
        {
            return cachedSchema;
        }

        var schemaPath = Path.Combine(environment.ContentRootPath, "Schemas", SchemaFileName);

        if (!File.Exists(schemaPath))
        {
            throw new FileNotFoundException("XSD-схема проекта не найдена.", schemaPath);
        }

        cachedSchema = File.ReadAllText(schemaPath);
        return cachedSchema;
    }
}
