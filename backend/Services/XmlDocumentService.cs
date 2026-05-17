using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using XML_IFC_generator.Contracts.Xml;

namespace XML_IFC_generator.Services;

public sealed class XmlDocumentService : IXmlDocumentService
{
    private const string ProjectXsd = """
        <?xml version="1.0" encoding="utf-8"?>
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
          <xs:element name="ConstructionProject">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="BasicInfo">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="ObjectName">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:minLength value="1" />
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:element>
                      <xs:element name="RegistrationNumber" type="xs:string" minOccurs="0" />
                      <xs:element name="DocumentDate" type="xs:date" minOccurs="0" />
                      <xs:element name="Uuid" type="xs:string" minOccurs="0" />
                      <xs:element name="Address" type="xs:string" minOccurs="0" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
                <xs:element name="CadastralNumbers" minOccurs="0">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="CadastralNumber" type="xs:string" maxOccurs="unbounded" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
                <xs:element name="PlanningDocuments" minOccurs="0">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="GpzuNumber" type="xs:string" minOccurs="0" maxOccurs="unbounded" />
                      <xs:element name="PptNumber" type="xs:string" minOccurs="0" maxOccurs="unbounded" />
                      <xs:element name="GzkNumber" type="xs:string" minOccurs="0" maxOccurs="unbounded" />
                      <xs:element name="KrtNumber" type="xs:string" minOccurs="0" maxOccurs="unbounded" />
                      <xs:element name="PpmNumber" type="xs:string" minOccurs="0" maxOccurs="unbounded" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
                <xs:element name="Organization" minOccurs="0">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="Name" type="xs:string" minOccurs="0" />
                      <xs:element name="Manager" type="xs:string" minOccurs="0" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
                <xs:element name="Team" minOccurs="0">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="Member" type="xs:string" maxOccurs="unbounded" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
                <xs:element name="WorkType" type="xs:string" minOccurs="0" />
                <xs:element name="FunctionalPurposes" minOccurs="0">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="Purpose" type="xs:string" maxOccurs="unbounded" />
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
        """;

    public GenerateXmlResponse GenerateAndValidate(GenerateXmlRequest request)
    {
        var xml = GenerateXml(request);
        var validation = Validate(xml);

        return new GenerateXmlResponse
        {
            Xml = xml,
            IsValid = validation.IsValid,
            Errors = validation.Errors
        };
    }

    public ValidateXmlResponse Validate(string xml)
    {
        if (string.IsNullOrWhiteSpace(xml))
        {
            return new ValidateXmlResponse
            {
                IsValid = false,
                Errors =
                [
                    new XmlValidationErrorDto
                    {
                        Message = "XML-файл пустой.",
                    }
                ]
            };
        }

        var errors = ValidateAgainstProjectSchema(xml);

        return new ValidateXmlResponse
        {
            IsValid = errors.Count == 0,
            Errors = errors
        };
    }

    public ParseXmlResponse Parse(string xml)
    {
        var validation = Validate(xml);

        if (!validation.IsValid)
        {
            return new ParseXmlResponse
            {
                IsValid = false,
                Errors = validation.Errors
            };
        }

        try
        {
            var document = XDocument.Parse(xml);
            var root = document.Root;

            if (root is null)
            {
                return new ParseXmlResponse
                {
                    IsValid = false,
                    Errors =
                    [
                        new XmlValidationErrorDto
                        {
                            Message = "Корневой элемент XML не найден.",
                        }
                    ]
                };
            }

            var basicInfo = root.Element("BasicInfo");
            var organization = root.Element("Organization");
            var planningDocuments = root.Element("PlanningDocuments");

            return new ParseXmlResponse
            {
                IsValid = true,
                Errors = [],
                Data = new GenerateXmlRequest
                {
                    Basic = new BasicInfoDto
                    {
                        Name = ElementValue(basicInfo, "ObjectName"),
                        RegistrationNumber = ElementValue(basicInfo, "RegistrationNumber"),
                        Date = ElementValue(basicInfo, "DocumentDate"),
                        Uuid = ElementValue(basicInfo, "Uuid"),
                        Address = ElementValue(basicInfo, "Address")
                    },
                    Organization = new OrganizationDto
                    {
                        Name = ElementValue(organization, "Name"),
                        Manager = ElementValue(organization, "Manager")
                    },
                    WorkType = ElementValue(root, "WorkType"),
                    CadastralNumbers = ElementValues(root.Element("CadastralNumbers"), "CadastralNumber"),
                    GpzuNumbers = ElementValues(planningDocuments, "GpzuNumber"),
                    PptNumbers = ElementValues(planningDocuments, "PptNumber"),
                    GzkNumbers = ElementValues(planningDocuments, "GzkNumber"),
                    KrtNumbers = ElementValues(planningDocuments, "KrtNumber"),
                    PpmNumbers = ElementValues(planningDocuments, "PpmNumber"),
                    TeamMembers = ElementValues(root.Element("Team"), "Member"),
                    FunctionalPurposes = ElementValues(root.Element("FunctionalPurposes"), "Purpose")
                }
            };
        }
        catch (XmlException exception)
        {
            return new ParseXmlResponse
            {
                IsValid = false,
                Errors =
                [
                    new XmlValidationErrorDto
                    {
                        Message = exception.Message,
                        LineNumber = exception.LineNumber,
                        LinePosition = exception.LinePosition
                    }
                ]
            };
        }
    }

    private static string GenerateXml(GenerateXmlRequest request)
    {
        var settings = new XmlWriterSettings
        {
            Encoding = new UTF8Encoding(encoderShouldEmitUTF8Identifier: false),
            Indent = true,
            OmitXmlDeclaration = false
        };

        using var stringWriter = new Utf8StringWriter();
        using var writer = XmlWriter.Create(stringWriter, settings);

        writer.WriteStartDocument();
        writer.WriteStartElement("ConstructionProject");

        writer.WriteStartElement("BasicInfo");
        writer.WriteElementString("ObjectName", request.Basic.Name.Trim());
        WriteOptionalElement(writer, "RegistrationNumber", request.Basic.RegistrationNumber);
        WriteOptionalElement(writer, "DocumentDate", NormalizeDate(request.Basic.Date));
        WriteOptionalElement(writer, "Uuid", request.Basic.Uuid);
        WriteOptionalElement(writer, "Address", request.Basic.Address);
        writer.WriteEndElement();

        WriteList(writer, "CadastralNumbers", "CadastralNumber", request.CadastralNumbers);

        writer.WriteStartElement("PlanningDocuments");
        WriteRepeatedElements(writer, "GpzuNumber", request.GpzuNumbers);
        WriteRepeatedElements(writer, "PptNumber", request.PptNumbers);
        WriteRepeatedElements(writer, "GzkNumber", request.GzkNumbers);
        WriteRepeatedElements(writer, "KrtNumber", request.KrtNumbers);
        WriteRepeatedElements(writer, "PpmNumber", request.PpmNumbers);
        writer.WriteEndElement();

        if (HasValue(request.Organization.Name) || HasValue(request.Organization.Manager))
        {
            writer.WriteStartElement("Organization");
            WriteOptionalElement(writer, "Name", request.Organization.Name);
            WriteOptionalElement(writer, "Manager", request.Organization.Manager);
            writer.WriteEndElement();
        }

        WriteList(writer, "Team", "Member", request.TeamMembers);
        WriteOptionalElement(writer, "WorkType", request.WorkType);
        WriteList(writer, "FunctionalPurposes", "Purpose", request.FunctionalPurposes);

        writer.WriteEndElement();
        writer.WriteEndDocument();
        writer.Flush();

        return stringWriter.ToString();
    }

    private static List<XmlValidationErrorDto> ValidateAgainstProjectSchema(string xml)
    {
        var errors = new List<XmlValidationErrorDto>();
        var schemas = new XmlSchemaSet();

        using var schemaReader = XmlReader.Create(new StringReader(ProjectXsd));
        schemas.Add(null, schemaReader);

        var settings = new XmlReaderSettings
        {
            Schemas = schemas,
            ValidationType = ValidationType.Schema
        };

        settings.ValidationEventHandler += (_, args) =>
        {
            errors.Add(new XmlValidationErrorDto
            {
                Message = args.Message,
                LineNumber = args.Exception?.LineNumber ?? 0,
                LinePosition = args.Exception?.LinePosition ?? 0,
                Severity = args.Severity.ToString()
            });
        };

        try
        {
            using var reader = XmlReader.Create(new StringReader(xml), settings);
            while (reader.Read())
            {
            }
        }
        catch (XmlException exception)
        {
            errors.Add(new XmlValidationErrorDto
            {
                Message = exception.Message,
                LineNumber = exception.LineNumber,
                LinePosition = exception.LinePosition
            });
        }

        return errors;
    }

    private static void WriteList(XmlWriter writer, string containerName, string itemName, IEnumerable<string> values)
    {
        var normalizedValues = values.Select(value => value.Trim()).Where(HasValue).ToList();

        if (normalizedValues.Count == 0)
        {
            return;
        }

        writer.WriteStartElement(containerName);
        WriteRepeatedElements(writer, itemName, normalizedValues);
        writer.WriteEndElement();
    }

    private static void WriteRepeatedElements(XmlWriter writer, string elementName, IEnumerable<string> values)
    {
        foreach (var value in values.Select(value => value.Trim()).Where(HasValue))
        {
            writer.WriteElementString(elementName, value);
        }
    }

    private static void WriteOptionalElement(XmlWriter writer, string elementName, string? value)
    {
        if (HasValue(value))
        {
            writer.WriteElementString(elementName, value!.Trim());
        }
    }

    private static string NormalizeDate(string value)
    {
        return DateOnly.TryParse(value, out var parsedDate)
            ? parsedDate.ToString("yyyy-MM-dd")
            : value.Trim();
    }

    private static bool HasValue(string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    private static string ElementValue(XContainer? container, string elementName)
    {
        return container?.Element(elementName)?.Value.Trim() ?? string.Empty;
    }

    private static List<string> ElementValues(XContainer? container, string elementName)
    {
        return container?
            .Elements(elementName)
            .Select(element => element.Value.Trim())
            .Where(HasValue)
            .ToList() ?? [];
    }

    private sealed class Utf8StringWriter : StringWriter
    {
        public override Encoding Encoding => Encoding.UTF8;
    }
}
