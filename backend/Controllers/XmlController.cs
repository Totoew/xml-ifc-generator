using Microsoft.AspNetCore.Mvc;
using XML_IFC_generator.Contracts.Xml;
using XML_IFC_generator.Services;

namespace XML_IFC_generator.Controllers;

[ApiController]
[Route("api/xml")]
public sealed class XmlController : ControllerBase
{
    private readonly IXmlDocumentService xmlDocumentService;

    public XmlController(IXmlDocumentService xmlDocumentService)
    {
        this.xmlDocumentService = xmlDocumentService;
    }

    [HttpPost("generate")]
    public ActionResult<GenerateXmlResponse> Generate(GenerateXmlRequest request)
    {
        return Ok(xmlDocumentService.GenerateAndValidate(request));
    }

    [HttpPost("validate")]
    public ActionResult<ValidateXmlResponse> Validate(ValidateXmlRequest request)
    {
        return Ok(xmlDocumentService.Validate(request.Xml));
    }

    [HttpPost("parse")]
    public ActionResult<ParseXmlResponse> Parse(ParseXmlRequest request)
    {
        return Ok(xmlDocumentService.Parse(request.Xml));
    }
}
