namespace XML_IFC_generator.Contracts.Xml;

public sealed class ValidateXmlResponse
{
    public required bool IsValid { get; init; }
    public required IReadOnlyCollection<XmlValidationErrorDto> Errors { get; init; }
}
