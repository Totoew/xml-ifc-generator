namespace XML_IFC_generator.Contracts.Xml;

public sealed class ParseXmlResponse
{
    public required bool IsValid { get; init; }
    public required IReadOnlyCollection<XmlValidationErrorDto> Errors { get; init; }
    public GenerateXmlRequest? Data { get; init; }
}
