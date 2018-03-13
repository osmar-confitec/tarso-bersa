using System;

namespace ApiConstruct.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string Usuario { get; set; }

        public string Senha { get; set; }
    }
}