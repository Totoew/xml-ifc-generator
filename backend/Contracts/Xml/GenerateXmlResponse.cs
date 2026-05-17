namespace XML_IFC_generator.Contracts.Xml;

public sealed class GenerateXmlResponse
{
    public required string Xml { get; init; }
    public required bool IsValid { get; init; }
    public required IReadOnlyCollection<XmlValidationErrorDto> Errors { get; init; }
}

public sealed class XmlValidationErrorDto
{
    public required string Message { get; init; }
    public int LineNumber { get; init; }
    public int LinePosition { get; init; }
    public string Severity { get; init; } = "Error";
}
