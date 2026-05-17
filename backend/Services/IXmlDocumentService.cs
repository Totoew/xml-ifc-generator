using XML_IFC_generator.Contracts.Xml;

namespace XML_IFC_generator.Services;

public interface IXmlDocumentService
{
    GenerateXmlResponse GenerateAndValidate(GenerateXmlRequest request);
    ValidateXmlResponse Validate(string xml);
    ParseXmlResponse Parse(string xml);
}
