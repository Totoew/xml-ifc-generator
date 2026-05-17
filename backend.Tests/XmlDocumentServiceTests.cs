using XML_IFC_generator.Contracts.Xml;
using XML_IFC_generator.Services;

namespace backend.Tests;

public sealed class XmlDocumentServiceTests
{
    private readonly XmlDocumentService service = new();

    [Fact]
    public void GenerateAndValidate_ReturnsValidXml_ForCompleteRequest()
    {
        var result = service.GenerateAndValidate(CreateRequest());

        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
        Assert.Contains("<ObjectName>Жилой дом</ObjectName>", result.Xml);
        Assert.Contains("<DocumentDate>2026-05-17</DocumentDate>", result.Xml);
        Assert.Contains("<CadastralNumber>77:01:0004010:123</CadastralNumber>", result.Xml);
    }

    [Fact]
    public void GenerateAndValidate_ReturnsValidationErrors_ForEmptyRequiredName()
    {
        var request = CreateRequest();
        request = new GenerateXmlRequest
        {
            Basic = new BasicInfoDto
            {
                Name = string.Empty,
                Date = request.Basic.Date
            },
            Organization = request.Organization,
            WorkType = request.WorkType,
            CadastralNumbers = request.CadastralNumbers,
            GpzuNumbers = request.GpzuNumbers,
            PptNumbers = request.PptNumbers,
            GzkNumbers = request.GzkNumbers,
            KrtNumbers = request.KrtNumbers,
            PpmNumbers = request.PpmNumbers,
            TeamMembers = request.TeamMembers,
            FunctionalPurposes = request.FunctionalPurposes
        };

        var result = service.GenerateAndValidate(request);

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
        Assert.Contains(result.Errors, error => error.Message.Contains("ObjectName", StringComparison.Ordinal));
    }

    [Fact]
    public void Validate_ReturnsError_ForMalformedXml()
    {
        var result = service.Validate("<ConstructionProject><BasicInfo>");

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
    }

    [Fact]
    public void Parse_ReturnsFormData_ForValidXml()
    {
        var generated = service.GenerateAndValidate(CreateRequest());

        var parsed = service.Parse(generated.Xml);

        Assert.True(parsed.IsValid);
        Assert.NotNull(parsed.Data);
        Assert.Equal("Жилой дом", parsed.Data.Basic.Name);
        Assert.Equal("77-01", parsed.Data.Basic.RegistrationNumber);
        Assert.Equal("ИнПАД", parsed.Data.Organization.Name);
        Assert.Equal(["77:01:0004010:123"], parsed.Data.CadastralNumbers);
        Assert.Equal(["Петров"], parsed.Data.TeamMembers);
        Assert.Equal(["Жилое"], parsed.Data.FunctionalPurposes);
    }

    [Fact]
    public void Parse_DoesNotReturnData_ForInvalidXml()
    {
        const string xml = """
            <ConstructionProject>
              <BasicInfo>
                <ObjectName />
                <DocumentDate>not-a-date</DocumentDate>
              </BasicInfo>
            </ConstructionProject>
            """;

        var parsed = service.Parse(xml);

        Assert.False(parsed.IsValid);
        Assert.Null(parsed.Data);
        Assert.NotEmpty(parsed.Errors);
    }

    private static GenerateXmlRequest CreateRequest()
    {
        return new GenerateXmlRequest
        {
            Basic = new BasicInfoDto
            {
                Name = "Жилой дом",
                RegistrationNumber = "77-01",
                Date = "2026-05-17",
                Uuid = "demo",
                Address = "Москва"
            },
            Organization = new OrganizationDto
            {
                Name = "ИнПАД",
                Manager = "Иванов"
            },
            WorkType = "new",
            CadastralNumbers = ["77:01:0004010:123"],
            GpzuNumbers = ["GPZU-1"],
            TeamMembers = ["Петров"],
            FunctionalPurposes = ["Жилое"]
        };
    }
}
