using Microsoft.AspNetCore.Mvc;

namespace XML_IFC_generator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Check() => Ok(new { status = "Healthy" });
}