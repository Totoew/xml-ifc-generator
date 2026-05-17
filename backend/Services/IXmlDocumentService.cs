using XML_IFC_generator.Contracts.Xml;

namespace XML_IFC_generator.Services;

public interface IXmlDocumentService
{
    GenerateXmlResponse GenerateAndValidate(GenerateXmlRequest request);
}
