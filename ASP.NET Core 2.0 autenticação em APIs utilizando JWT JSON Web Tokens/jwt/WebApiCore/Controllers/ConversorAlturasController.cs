using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading;
using System.Collections.ObjectModel;

namespace WebApiCore.Controllers
{

    [Route("api/[controller]")]
    public class ConversorAlturasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Authorize("Bearer")]
        [HttpGet("PesMetros/{alturaPes}")]
        public object Get(double alturaPes)
        {

          
            return new
            {
                AlturaPes = alturaPes,
                AlturaMetros = Math.Round(alturaPes * 0.3048, 4)
            };
        }

    }
}