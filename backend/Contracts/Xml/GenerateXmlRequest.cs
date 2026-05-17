namespace XML_IFC_generator.Contracts.Xml;

public sealed class GenerateXmlRequest
{
    public BasicInfoDto Basic { get; init; } = new();
    public OrganizationDto Organization { get; init; } = new();
    public string WorkType { get; init; } = string.Empty;
    public List<string> CadastralNumbers { get; init; } = [];
    public List<string> GpzuNumbers { get; init; } = [];
    public List<string> PptNumbers { get; init; } = [];
    public List<string> GzkNumbers { get; init; } = [];
    public List<string> KrtNumbers { get; init; } = [];
    public List<string> PpmNumbers { get; init; } = [];
    public List<string> TeamMembers { get; init; } = [];
    public List<string> FunctionalPurposes { get; init; } = [];
}

public sealed class BasicInfoDto
{
    public string Name { get; init; } = string.Empty;
    public string RegistrationNumber { get; init; } = string.Empty;
    public string Date { get; init; } = string.Empty;
    public string Uuid { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public sealed class OrganizationDto
{
    public string Name { get; init; } = string.Empty;
    public string Manager { get; init; } = string.Empty;
}
