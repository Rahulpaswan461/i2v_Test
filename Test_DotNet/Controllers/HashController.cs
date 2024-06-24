using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace Test_DotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HashController : ControllerBase
    {
        [HttpGet("{firstName}")]
        public IActionResult GetHash(string firstName)
        {
            string input = firstName;
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            
            using (var hash = SHA256.Create())
            {
                byte[] hashedBytes = hash.ComputeHash(inputBytes);
                
                // Convert byte array to hexadecimal string representation
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < hashedBytes.Length; i++)
                {
                    builder.Append(hashedBytes[i].ToString("x2")); // "x2" formats byte to hexadecimal
                }
                string hashString = builder.ToString();
                
                // Return a HashResponse Object which contains the hashString
                var response = new HashResponse
                {
                    Hash = hashString
                };
                
                return Ok(response);
            }
        }

    }

    public class HashResponse
    {
        public string Hash { get; set; }
    }
}
